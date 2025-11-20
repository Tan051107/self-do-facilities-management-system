import apuLogo from '../images/apu-logo.png'
import '../css/NotFoundPage.css'
import { Link } from 'react-router-dom';

export default function NotFoundPage(){
    const role = localStorage.getItem("user-role");

    return(
        <div className="outer-content-container">
            <div className="content-container">
                <img src={apuLogo} alt="" className="apu-logo"/>
                <div className="right-content-container">
                    <h1 className="not-found-title">404</h1>
                    <h2 className="not-found-subtitle">Page Not Found</h2>
                    <p className="not-found-desc">Sorry! This page doesn't seems to exist.</p>
                    <Link to={role==="admin" ? "/admin" : "/"} className="link"><button className="home-button">Back to Home <span className="material-symbols-rounded">arrow_forward</span></button></Link>
                </div>
            </div>
        </div>
    )
}