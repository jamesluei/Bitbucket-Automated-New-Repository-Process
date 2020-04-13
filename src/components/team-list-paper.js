import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Link } from "react-router-dom";
import CardMedia from '@material-ui/core/CardMedia';
import './css/team-list-paper.css'

export default function TeamListPaper(props) {
    console.log(props)
    return (
        <Link to={props.url}>
            <div className="root-teamlist">
                <div className={"data-image"}>
                    {props.info
                        ? <CardMedia
                            className="data-image-content"
                            image={props.info.links.avatar.href}
                        /> : ""
                    }
                </div>
                <div className="data-content">
                    {props.display_name}
                    <p>{}</p>
                </div>
            </div>
        </Link>
    );
}