import React from 'react'
import { Link } from 'react-router-dom';

const Admin = () => {
    return (
        <><div>
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <h4 className="navbar-brand"> Course Bundle</h4>
                    <Link to="/bundle"> <button class="btn btn-outline-success" type="submit">New Bundle</button> </Link>
                </div>
            </nav>
        </div>
        </>
    )
}

export default Admin;