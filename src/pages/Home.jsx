import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';

import jobOffers from '../db/jobOffers.json';

import { getNFTs } from '../utils/getNFTs';
import { Network } from 'alchemy-sdk';
import { useAccount } from 'wagmi';

import { useUserContext } from '../app-context/user-context-provider';

export default function Home() {    
    const { address, isConnected } = useAccount()
    const {
        nftAddressesObject, //Hay que ver dónde se debe hacer la llamada a getNFTs
        isError,
        fetchNFTs
    } = getNFTs(address);
    
    const [networks, setNetworks] = useState(
        {
        "Ethereum": Network.ETH_MAINNET,
        "Polygon": Network.MATIC_MAINNET,
        "Arbitrum": Network.ARB_MAINNET,
        "Optimism": Network.OPT_MAINNET
        }
    );
    
    useEffect(() => {
        if (isConnected) {
            console.log("La billetera conectada en Home es", address)
            const networkKeys = Object.keys(nftAddressesObject);
            networkKeys.forEach((networkName) => {
                console.log("Llamando a Alchemy desde Home. Red:", networkName)
                fetchNFTs(address, networkName, networks[networkName]);
            });
        }

    }, [address]);

    const { filter, setFilter } = useUserContext();
    let filteredOffers;

    switch (filter) {
        case "match":
            filteredOffers = jobOffers.filter((offer) => {
              for (const network in offer.requiredCertificates) {
                const certificates = offer.requiredCertificates[network];
                for (const cert of certificates) {
                  if (!nftAddressesObject[network] || !nftAddressesObject[network].includes(cert)) {
                    console.log("Address:", address, "Network:", network, "NFTs:", nftAddressesObject[network])
                    return false; // Return false if at least one required certificate does not match the user's certificates
                  }
                }
              }
              return true; // Return true if all certificates match
            });
            break;
        case "noMatch":
            filteredOffers = jobOffers.filter((offer) => {
              for (const network in offer.requiredCertificates) {
                const certificates = offer.requiredCertificates[network];
                for (const cert of certificates) {
                  if (!nftAddressesObject[network] || !nftAddressesObject[network].includes(cert)) {
                    return true; // Return false if at least one required certificate does not match the user's certificates
                  }
                }
              }
              return false; // Return true if all certificates match
            });
            break;
        default:
            filteredOffers = jobOffers;
            break;
    }

    return (
        <div>
            <div className="tabs">
                <div className={filter === "" ? "tab active" : "tab"} onClick={() => setFilter("")}>All offers</div>
                <div className={filter === "match" ? "tab active" : "tab"} onClick={() => setFilter("match")}>Qualified</div>
                <div className={filter === "noMatch" ? "tab active" : "tab"} onClick={() => setFilter("noMatch")}>Not qualified</div>
            </div>
            <div className="job-counter">
                {filter === "match" ? (
                    !isConnected ? "Please, connect your wallet.":
                    filteredOffers.length > 0 ? (
                        filteredOffers.length > 1 ? (                            
                            `${filteredOffers.length} offers match your qualifications`
                        ) : (
                            `${filteredOffers.length} offer matches your qualifications`
                        )
                    ) : (
                        "No job offers match your qualifications"
                    )
                ) : filter === "noMatch" ? (
                    !isConnected ? "Please, connect your wallet." :
                    filteredOffers.length > 0 ? (
                        filteredOffers.length > 1 ? (                            
                            `${filteredOffers.length} offers do not match your qualifications`
                        ) : (
                            `${filteredOffers.length} offer does not match your qualifications`
                        )
                    ) : (
                        "All offers match your qualifications"
                    )
                ) : (
                    `${filteredOffers.length} offers available`
                )}
            </div>

            <div className="job-offers-list">
                {
                (filter !== "" && !isConnected) ? 
                    "" : 
                    filteredOffers.map(offer => <JobCard key={offer.id} job={offer} />)
                }
            </div>
        </div>
    );
}