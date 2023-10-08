import { Link, useParams } from 'react-router-dom';
import jobOffers from '../db/jobOffers.json';
import Modal from '../components/Modal/Modal'
import { useState } from 'react';
import '../components/Modal/Modal.css'

import { getCertificatesByAdd } from '../utils/getCertificates';

import { useUserContext } from '../app-context/user-context-provider';

function fetchJobDetailsById(id) {
    return jobOffers.find(offer => offer.id === Number(id));
}

function flattenRequiredCertificates(certificatesObject) {
    let addresses = [];

    for (const network in certificatesObject) {
        addresses = addresses.concat(certificatesObject[network]);
    }

    return addresses;
}

function Offer() {
    const { id } = useParams();
    const job = fetchJobDetailsById(id);
    const logoSrc = job.companyLogo === "" ? "https://i.ibb.co/3mM1sNd/empty-logo.jpg" : job.companyLogo;
    const descriptionParagraphs = job.description.split('\n')
    const flattenedAddresses = flattenRequiredCertificates(job.requiredCertificates);
    const certificatesNames = getCertificatesByAdd(flattenedAddresses);

    const [isModalOpen, setModalOpen] = useState(false);
    const { filter } = useUserContext();

    const handleApplicationSubmit = () => {
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
            window.location.href = "/";  // Redirects to the homepage
    }

    return (
        <div className="offer-card">
            <div className="job-header">
                <img className="offer-card-logo" src={logoSrc} alt="Company Logo" />
                <h2>{job.title}</h2>
                <a href={job.companyURL} target="_blank" rel="noopener noreferrer" className="company-link">{job.companyName}</a>
            </div>
            <p className="job-details">
                {job.city} | {job.presence} | {job.contractType}
            </p>
            {descriptionParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
            <p className="job-footer">
                Posted on: {new Date(job.createdTimestamp).toLocaleDateString()} | Salary: {job.salary}
            </p>
            <h3>Requirements</h3>
            <div className="requirements">
                {certificatesNames.map((name, index) =>
                    name !== null && <div key={index} className="certificate-box">{name}</div>
                )}
            </div>
            {/* Optional back button to navigate back to listings */}
            {
                (filter !== "match") ? null :
                    <Link
                        to="#"
                        className="apply-link"
                        onClick={handleApplicationSubmit}>
                        APPLY
                    </Link>
            }
            <Modal show={isModalOpen} onClose={handleCloseModal}>
                <h4>Success!</h4>
                <p>Your application has been submitted.</p>

            </Modal>
            <Link to="/" className="back-to-listings">
                <i className="fas fa-arrow-left"></i> Back to Listings
            </Link>

        </div>
    );
}

export default Offer;
