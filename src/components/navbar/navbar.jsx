import React, { useState, useEffect, useRef, useCallback } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import MenuIcon from "./MenuIcon";
import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers"; 
// import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";

import {gaslessOnboarding}  from "../onboard/onboard";


// import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";
// import { InjectedConnector } from "wagmi/connectors/injected";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  // const [error, setError] = useState();
  let navigate = useNavigate();
  // const { address, isConnected } = useAccount();
  // const signer = useSigner();
  // const { connect } = useConnect({
  //   connector: new InjectedConnector(),
  // });

  // const { disconnect } = useDisconnect();
  const walletOptions = useRef();
  const menuRef = useRef();
  const exploreMenuRef = useRef();

  // const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [connected, setConnection] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [account, setAccount] = useState(null);
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [chain, setChainStatus] = useState(false);

  // const connectMeta = () => {
  //   connect();
  //   checkChain();
  //   setAccount(address);
  //   setShowOptions(false);
  // };

  const [walletAddress, setWalletAddress] = useState("");
    const [gaslessWallet, setGaslessWallet] = useState({});
    const [web3AuthProvider, setWeb3AuthProvider] = useState(null);
  
    const login = async () => {
      try {
        await gaslessOnboarding.init();
        const provider = await gaslessOnboarding.login();
        console.log(provider);
        if (provider) {
          setWeb3AuthProvider(provider);
        }
  
        const gaslessWallet = await gaslessOnboarding.getGaslessWallet();
        if (!gaslessWallet.isInitiated()) await gaslessWallet.init();
        const address = gaslessWallet.getAddress();
        console.log(address)
        setGaslessWallet(gaslessWallet);
        setWalletAddress(address);
        setShowOptions(false);
        setConnection(true);
      } catch (error) {
        console.log(error);
      }
    };
  
    const logout = async () => {
      await gaslessOnboarding?.logout();
  
      setWeb3AuthProvider(null);
      setGaslessWallet(undefined);
      setWalletAddress(undefined);
      console.log(gaslessOnboarding)
    };
  // const connectTron = async () => {
  //   if (window.tronWeb) {
  //     const address = await window.tronWeb.request({
  //       method: "tron_requestAccounts",
  //     });
  //     console.log(address);
  //     if (address.code === 200) {
  //       console.log(window.tronWeb.defaultAddress.base58);
  //       setShowOptions(false);
  //       setConnection(true);
  //       setAccount(window.tronWeb.defaultAddress.base58);
  //     } else {
  //       // alert("Something went wrong");
  //     }
  //   } else {
  //     alert("please install a tronlink wallet to proceed.");
  //   }
  // };

  // const disconnectTron = () => {
  //   disconnect();
  //   if (window.tronWeb) {
  //     // window.tronWeb.disconnect();
  //     setConnection(false);
  //   }
  // };

  const addChain = () => {
    if (window.ethereum) {
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x13881",
            rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
            chainName: "Mumbai Testnet",
            // nativeCurrency: {
            //     name: "BitTorrent",
            //     symbol: "BTT",
            //     decimals: 18
            // },
            blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
          },
        ],
      });
      setChainStatus(false);
    } else {
      alert("Please Install a wallet to proceed.");
    }
  };

  const checkChain = async () => {
    if (window.ethereum) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId !== 80001) {
        // setChainStatus(true);
        addChain();
        return true;
      } else {
        // setChainStatus(false);
        return false;
      }
    } else {
      alert("Please install a wallet.");
    }
  };

  const checkConnection = async() => {
    const gaslessWallet = await gaslessOnboarding.getGaslessWallet();
    return !gaslessWallet.isInitiated()

  }

  useEffect( async () => {
    // console.log(isConnected);
    const connection = await checkConnection()
    console.log(connection);
    if (connection) {
      setConnection(true);
    } else {
      setConnection(false);
    }
  }, [walletAddress]);

  // useEffect(() => {
  //   if (isConnected) {
  //     checkChain();
  //     setConnection(true);
  //     fetchNotification();
  //     allNotification();
  //   } else {
  //     setConnection(false);
  //   }
  //   if (window.tronWeb) {
  //     if (window.tronWeb.defaultAddress.base58) {
  //       setConnection(true);
  //       setAccount();
  //     } else {
  //       setConnection(false);
  //     }
  //   }
  // }, []);


  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        walletOptions.current &&
        !walletOptions.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [walletOptions]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        exploreMenuRef.current &&
        !exploreMenuRef.current.contains(event.target)
      ) {
        setShowExploreMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exploreMenuRef]);

  // useEffect(() => {
  //   if (notifications) {
  //     allNotification();
  //   }
  // }, [notifications]);

  // useEffect(() => {
  //   if (!window.tronWeb.defaultAddress) {
  //     disconnectTron();
  //   }
  // }, [window.tronWeb, window.tronWeb.defaultAddress])

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <img
            style={{ width: "250px", height: "80px" }}
            src={logo}
            alt="logo"
          />
        </Link>
        {/* <div onClick={handleClick} className="nav-icon">
        {open ? <FiX /> : <FiMenu />}
      </div> */}
        {/* <ul className={open ? "nav-links" : "nav-links active"}> */}
        <ul className="nav-links">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <div className="navtextstyle">Home</div>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/player" className="nav-link">
              <div className="navtextstyle">Player</div>
            </Link>
          </li>
          <li className="nav-item">
            <span
              className="nav-link"
              onClick={() => {
                setShowExploreMenu(!showMenu);
              }}
            >
              <div className="navtextstyle">Explore</div>
            </span>
            {/* <span>
              <Link className="navtextstyle" to="/all-artists">Explore</Link>
            </span> */}
            {showExploreMenu ? (
              <div className="nav-sub-menu" ref={exploreMenuRef}>
                <ul className="nav-sub-menu">
                  <li>
                    <Link
                      to="/all-nfts"
                      onClick={() => {
                        setShowExploreMenu(false);
                      }}
                      className="nav-sub-menu-link"
                    >
                      All NFTs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/all-artists"
                      onClick={() => {
                        setShowExploreMenu(false);
                      }}
                      className="nav-sub-menu-link"
                    >
                      All Artists
                    </Link>
                  </li>
                </ul>
              </div>
            ) : null}
          </li>
          {/* <li className="nav-item">
            <Link to="/explore" className="nav-link">
              <div className="navtextstyle">Explore</div>
            </Link>
          </li> */}
          {connected  ? (
            <>
              <li className="nav-item">
                <span
                  className="nav-link"
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                >
                  <div className="navtextstyle">Stream</div>
                </span>
                {showMenu ? (
                  <div className="nav-sub-menu" ref={menuRef}>
                    <ul className="nav-sub-menu">
                      <li>
                        <Link
                          to="/streaming"
                          onClick={() => {
                            setShowMenu(false);
                          }}
                          className="nav-sub-menu-link"
                        >
                          Go Live
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/all-stream"
                          onClick={() => {
                            setShowMenu(false);
                          }}
                          className="nav-sub-menu-link"
                        >
                          All Streams
                        </Link>
                      </li>
                      {/* <li>
                            <Link to="/all-live-stream" onClick={() => { setShowMenu(false) }} className="nav-sub-menu-link">Live Streams</Link>
                          </li> */}
                    </ul>
                  </div>
                ) : null}
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <div className="navtextstyle">Profile</div>
                </Link>
              </li>
              
              
              {/* {
                  chain
                    ?
                    <div className="main">
                      <div className="add-chain-main">
                        <div className="add-chain-box">
                          <p className="add-chain-message">
                            Currently our application only supports bittorrent testnet. Please add the BTT chain. If you have already added please switch to BTT.
                          </p>
                          <button className="add-chain-btn" onClick={() => { addChain() }}>add chain</button>
                        </div>
                      </div>
                    </div>
                    :
                    null
                } */}
            </>
          ) : (
            <li className="nav-item-btn">
              <button
                className="nav-button"
                onClick={() => {
                  // setShowOptions(true);
                  login();
                }}
              >
                Connect
              </button>
            </li>
          )}
        </ul>
        <div
          className="nav-ham-menu"
          onClick={() => {
            setMenu(!menu);
          }}
        >
          <MenuIcon />
        </div>
        {menu ? (
          <div className="mobile-menu">
            <ul>
              <li>
                <span
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Home
                </span>
              </li>
              <li className="nav-sub-menu-player">
                <span>
                </span>
              </li>

              <li className="nav-sub-menu-player">
                <span
                  onClick={() => {
                    navigate("/player");
                  }}
                >
                  Player
                </span>
              </li>
              <li>
                <span
                  onClick={() => {
                    setShowExploreMenu(!showMenu);
                  }}
                >
                  <div>Explore</div>
                </span>
                {/* <span>
              <Link className="navtextstyle" to="/all-artists">Explore</Link>
            </span> */}
                {showExploreMenu ? (
                  <div className="nav-sub-menu" ref={exploreMenuRef}>
                    <ul className="nav-sub-menu">
                      <li>
                        <Link
                          to="/all-nfts"
                          onClick={() => {
                            setShowExploreMenu(false);
                          }}
                          className="nav-sub-menu-link"
                        >
                          All NFTs
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/all-artists"
                          onClick={() => {
                            setShowExploreMenu(false);
                          }}
                          className="nav-sub-menu-link"
                        >
                          All Artists
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>

              {connected  ? (
                <>
                  <li>
                    <span
                      onClick={() => {
                        setShowMenu(!showMenu);
                      }}
                    >
                      <div>Stream</div>
                    </span>
                    {showMenu ? (
                      <div className="nav-sub-menu" ref={menuRef}>
                        <ul className="nav-sub-menu">
                          <li>
                            <Link
                              to="/streaming"
                              onClick={() => {
                                setShowMenu(false);
                              }}
                              className="nav-sub-menu-link"
                            >
                              Go Live
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/all-stream"
                              onClick={() => {
                                setShowMenu(false);
                              }}
                              className="nav-sub-menu-link"
                            >
                              All Streams
                            </Link>
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </li>
                  <li>
                    <Link to="/profile">
                      <div className="nav-sub-menu-profile">Profile</div>
                    </Link>
                  </li>
                  <li className="nav-item-btn">
              <button
                className="nav-button"
                onClick={() => {
                  // setShowOptions(true);
                  login();
                }}
              >
                Connect
              </button>
            </li>

                  <li className="nav-item-ctbtn">
                  <li className="nav-item">
          </li>
                  </li>
                </>
              ) : (
                <li className="mobile-menu-btn">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <div className="navtextstyle"><button onClick={() => login()}>Login</button></div>
            </Link>
          </li>
                </li>
              )}
            </ul>
          </div>
        ) : null}
      </nav>
      {showOptions ? (
        <div className="connection-options-container">
          <div className="connection-options">
            <div className="options-holder" ref={walletOptions}>
              <div className="options-heading">
                <h2>Please connect with wallets provided</h2>
              </div>
              <div className="options-container">
                <span className="wallets">
                  <img
                    className="wallet-image"
                    // onClick={() => {
                    //   connectMeta();
                    // }}
                    src="images/mm.png"
                    alt="Connect to Metamask"
                  />
                </span>
                <span className="wallets">
                  <img
                    className="wallet-image"
                    onClick={() => {
                      login();
                    }}
                    src="images/tl.svg"
                    alt="Connect to TronLink"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

    </>
  );
};

export default Navbar;
