import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Container, Row, Col, Modal, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SuperheroDashboard.css';
import axios from 'axios';

function SuperheroDashboard() {
    const [grievances, setGrievances] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGrievances, setFilteredGrievances] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [districts, setDistricts] = useState([
        'Thiruvananthapuram',
        'Kollam',
        'Pathanamthitta',
        'Alappuzha',
        'Kottayam',
        'Idukki',
        'Ernakulam',
        'Thrissur',
        'Palakkad',
        'Malappuram',
        'Kozhikode',
        'Wayanad',
        'Kannur',
        'Kasargod'
    ]);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch grievances from the server
        axios.get('http://localhost:3000/grievance-submit')
            .then(response => {
                setGrievances(response.data);
            })
            .catch(error => {
                console.error('Error fetching grievances:', error);
            });
    }, []);

    useEffect(() => {
        // Perform filtering whenever searchTerm or selectedDistrict changes
        const normalizedSearchTerm = searchTerm.toLowerCase();
        const normalizedSelectedDistrict = selectedDistrict.toLowerCase();

        const results = grievances.filter(g =>
            (g.name.toLowerCase().includes(normalizedSearchTerm) ||
                g.district.toLowerCase().includes(normalizedSearchTerm)) &&
            (normalizedSelectedDistrict === '' || g.district.toLowerCase() === normalizedSelectedDistrict)
        );

        setFilteredGrievances(results);
    }, [searchTerm, selectedDistrict, grievances]);

    const handleSearch = () => {
        // This is handled by useEffect, so handleSearch might be redundant
    };

    const handleView = (grievance) => {
        setSelectedGrievance(grievance);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedGrievance(null);
    };

    const handleFilterDistrict = (district) => {
        setSelectedDistrict(district);
    };

    const truncateGrievance = (text) => {
        return text.split(' ').slice(0, 4).join(' ') + '...';
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/grievance-submit/${id}`)
            .then(() => {
                // Remove the deleted grievance from the state
                setGrievances(grievances.filter(g => g._id !== id));
                // Also update filtered grievances if needed
                setFilteredGrievances(filteredGrievances.filter(g => g._id !== id));
            })
            .catch(error => {
                console.error('Error deleting grievance:', error);
            });
    };

    const handleLogout = () => {
        // Clear the email from localStorage (or JWT token if using one)
        localStorage.removeItem('email');
        // Redirect to the login page
        navigate('/');
    };

    return (
        <Container fluid className="min-h-screen p-6 bg-gradient-to-r from-gray-900 to-gray-800">
            <Row className="justify-content-between align-items-center mb-4">
                <Col md={10}>
                    <h1 className="text-center text-2xl lg:text-4xl text-orange-400 font-bold mb-6 text-3d">
                        Guardian's Gate Dashboard
                    </h1>
                </Col>
                <Col md={2} className="text-right">
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={10}>
                    <Form className="d-flex mb-4">
                        <Form.Control
                            type="search"
                            placeholder="Search by name or district"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="mr-2 w-82"
                        />
                        <Button variant="primary" onClick={handleSearch} className="mr-2">Search</Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                Filter by District
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {districts.map((district, index) => (
                                    <Dropdown.Item key={index} onClick={() => handleFilterDistrict(district)}>
                                        {district}
                                    </Dropdown.Item>
                                ))}
                                <Dropdown.Item onClick={() => handleFilterDistrict('')}>
                                    All Districts
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form>

                    <Table striped bordered hover variant="dark" responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>District</th>
                                <th>Phone</th>
                                <th>Grievance</th>
                                <th>Date Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGrievances.map((g, index) => (
                                <tr key={index}>
                                    <td>{g.name}</td>
                                    <td>{g.email}</td>
                                    <td>{g.district}</td>
                                    <td>{g.phone}</td>
                                    <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {truncateGrievance(g.complaint)}
                                    </td>
                                    <td>{g.dateSubmitted}</td>
                                    <td>
                                        <div className="flex sm:space-x-2 space-x-4">
                                            <Button variant="warning" className="btn-sm font-semibold" onClick={() => handleView(g)}>View</Button>
                                            <Button variant="danger" className="btn-sm font-semibold" onClick={() => handleDelete(g._id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Grievance Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedGrievance && (
                        <>
                            <p><strong>Name:</strong> {selectedGrievance.name}</p>
                            <p><strong>Email:</strong> {selectedGrievance.email}</p>
                            <p><strong>District:</strong> {selectedGrievance.district}</p>
                            <p><strong>Phone:</strong> {selectedGrievance.phone}</p>
                            <p><strong>Grievance:</strong> {selectedGrievance.complaint}</p>
                            <p><strong>Date Submitted:</strong> {selectedGrievance.dateSubmitted}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default SuperheroDashboard;
