import { clusterApiUrl, Connection } from '@solana/web3.js';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { createContext, ReactNode, useContext } from 'react';
import toast from 'react-hot-toast';

export interface Cluster {
  name: string;
  endpoint: string;
  network?: ClusterNetwork;
  active?: boolean;
}

export enum ClusterNetwork {
  Mainnet = 'mainnet-beta',
  Testnet = 'testnet',
  Devnet = 'devnet',
  Custom = 'custom',
}

// Default Clusters with QuickNode for Mainnet-Beta
export const defaultClusters: Cluster[] = [
  {
    name: 'mainnet-beta',
    endpoint:
      'https://prettiest-flashy-wind.solana-mainnet.quiknode.pro/45fee519abbd5d4cac5f5c12044119d868ae84cb/',
    network: ClusterNetwork.Mainnet,
  },
  {
    name: 'devnet',
    endpoint: clusterApiUrl('devnet'),
    network: ClusterNetwork.Devnet,
  },
  { name: 'local', endpoint: 'http://localhost:8899' },
  {
    name: 'testnet',
    endpoint: clusterApiUrl('testnet'),
    network: ClusterNetwork.Testnet,
  },
];

// Atoms for Managing Clusters
const clusterAtom = atomWithStorage<Cluster>('solana-cluster', defaultClusters[0]);
const clustersAtom = atomWithStorage<Cluster[]>('solana-clusters', defaultClusters);

const activeClustersAtom = atom<Cluster[]>((get) => {
  const clusters = get(clustersAtom);
  const cluster = get(clusterAtom);
  return clusters.map((item) => ({
    ...item,
    active: item.name === cluster.name,
  }));
});

const activeClusterAtom = atom<Cluster>((get) => {
  const clusters = get(activeClustersAtom);
  return clusters.find((item) => item.active) || clusters[0];
});

export interface ClusterProviderContext {
  cluster: Cluster;
  clusters: Cluster[];
  addCluster: (cluster: Cluster) => void;
  deleteCluster: (cluster: Cluster) => void;
  setCluster: (cluster: Cluster) => void;
  getExplorerUrl(path: string): string;
}

const Context = createContext<ClusterProviderContext>({} as ClusterProviderContext);

export function ClusterProvider({ children }: { children: ReactNode }) {
  const cluster = useAtomValue(activeClusterAtom);
  const clusters = useAtomValue(activeClustersAtom);
  const setCluster = useSetAtom(clusterAtom);
  const setClusters = useSetAtom(clustersAtom);

  const value: ClusterProviderContext = {
    cluster,
    clusters: clusters.sort((a, b) => (a.name > b.name ? 1 : -1)),
    addCluster: (newCluster: Cluster) => {
      try {
        const testConnection = new Connection(newCluster.endpoint);
        testConnection
          .getVersion()
          .then(() => {
            setClusters([...clusters, newCluster]);
            toast.success(`Cluster added: ${newCluster.name}`);
          })
          .catch((err) => {
            throw new Error(`Invalid endpoint: ${err.message}`);
          });
      } catch (err) {
        toast.error(`${err}`);
      }
    },
    deleteCluster: (clusterToDelete: Cluster) => {
      setClusters(clusters.filter((item) => item.name !== clusterToDelete.name));
    },
    setCluster: (newCluster: Cluster) => setCluster(newCluster),
    getExplorerUrl: (path: string) =>
      `https://explorer.solana.com/${path}${getClusterUrlParam(cluster)}`,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCluster() {
  return useContext(Context);
}

function getClusterUrlParam(cluster: Cluster): string {
  let suffix = '';
  switch (cluster.network) {
    case ClusterNetwork.Devnet:
      suffix = 'devnet';
      break;
    case ClusterNetwork.Mainnet:
      suffix = '';
      break;
    case ClusterNetwork.Testnet:
      suffix = 'testnet';
      break;
    default:
      suffix = `custom&customUrl=${encodeURIComponent(cluster.endpoint)}`;
      break;
  }

  return suffix.length ? `?cluster=${suffix}` : '';
}