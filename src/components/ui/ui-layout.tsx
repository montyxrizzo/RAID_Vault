import { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast'
import { Link, useLocation } from 'react-router-dom'

import { AccountChecker } from '../account/account-ui'
import { ClusterChecker, ClusterUiSelect, ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'

export function UiLayout({ children, links }: { children: ReactNode; links: { label: string; path: string }[] }) {
  const pathname = useLocation().pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility

  return (
    <div className="h-full flex flex-col">
      {/* Navbar */}
      <nav className="navbar bg-base-300 text-neutral-content fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4">
    {/* Logo */}
        <Link className="btn btn-ghost normal-case text-xl rounded-full flex items-center space-x-2" to="/">
          {/* <div className="relative"> */}
            {/* Logo Wrapper */}
            <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
          <img
            className="h-full w-full rounded-full object-cover"
            alt="Logo"
            src="/raid_token_close.png"
          />
        </div>
          {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-green-400 opacity-20 rounded-full"></div>
        </div>
        <div
          className="hidden md:inline-block text-base font-semibold bg-clip-text text-transparent 
          bg-gradient-to-r from-green-400 via-purple-500 to-indigo-400 tracking-tight leading-snug"
        >
          Remote <span className="text-white">AI</span> Infrastructure
          <br />
          Deployment
        </div> */}
      </Link>


          {/* Hamburger Menu Button (visible on mobile only) */}
          <button
            className="btn btn-ghost md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4 items-center">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={`hover:text-indigo-400 ${pathname.startsWith(path) ? "text-indigo-400 font-bold" : ""}`}
                  to={path}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
            <a
  href="https://v2.raydium.io/swap/"
  target="_blank"
  rel="noopener noreferrer"
  className="text-green-400 font-semibold p-2 rounded-lg transition-colors duration-300 hover:bg-green-100 hover:text-green-500"
>
  # GET RAID
</a>

            </li>
            &nbsp;

          </ul>
          
 
          {/* Wallet and Cluster Select */}
          <div className="hidden md:flex items-center space-x-2">
            <WalletButton />
            <ClusterUiSelect />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="md:hidden bg-base-300 px-4 pt-2 pb-4 shadow-md z-40">
             <ul className="space-y-2">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    className={`block py-2 hover:text-indigo-400 ${
                      pathname.startsWith(path) ? "text-indigo-400 font-bold" : ""
                    }`}
                    to={path}
                    onClick={() => setIsMenuOpen(false)} // Close menu on link click 
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://v2.raydium.io/swap/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-green-400 font-semibold"
                  onClick={() => setIsMenuOpen(false)} // Close menu on external link click
                >
                  #GET RAID
                </a>
              </li>
            </ul>
            <div className="mt-4 flex justify-end space-x-2">
              <WalletButton />
              <ClusterUiSelect />
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <div className="mt-[72px] flex-grow mx-4 lg:mx-auto"> {/* Add margin-top to avoid overlap with fixed navbar */}
        <ClusterChecker>
          <AccountChecker />
        </ClusterChecker>
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </div>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
  <aside>
    {/* <p>
      Developed with ❤️ in Philadelphia{" "}
      <a
        className="link hover:text-white"
        href=""
        target="_blank"
        rel="noopener noreferrer"
      ></a>
    </p> */}
    <p className="mt-2">
    © 2024 RAID Network. All rights reserved.
    </p>
    <div className="flex space-x-4 mt-2 text-sm text-gray-500">
      <a
        href="/terms"
        className="hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms
      </a>
      <a
        href="/privacy"
        className="hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy
      </a>
      <a
        href="/security"
        className="hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Security
      </a>
    </div>
  </aside>
</footer>

    </div>
  );
}


export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = '/favicon.ico'; // Update this to the correct path for your favicon
    document.head.appendChild(link);
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? <h1 className="text-5xl font-bold">{title}</h1> : title}
          {typeof subtitle === 'string' ? <p className="py-6">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} className="btn btn-xs btn-primary" />
      </div>,
    )
  }
}
