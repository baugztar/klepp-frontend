import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import axios from "axios";
import React from "react"
import KleppVideoPlayer from "./KleppVideoPlayer";

interface KleppVideoGridItemsProps {
    accessToken?: string,
    userName?: string
}

interface KleppVideoGridItemsState {
    items: KleppVideoFile[],
    hiddenItems: KleppVideoFile[]
}

interface KleppVideoFile {
    fileName: string;
    uri: string;
    datetime: string;
    username: string
}

interface KleppVideoResponse {
    files: KleppVideoFile[],
    hiddenFiles: KleppVideoFile[]
}

export default class KleppVideoGrid extends React.Component<KleppVideoGridItemsProps, KleppVideoGridItemsState> {
    constructor(props: KleppVideoGridItemsProps) {
        super(props);
        this.state = {
            items: [],
            hiddenItems: []
        }
    }

    componentDidMount() {
        const config = {
            headers: { Authorization: `Bearer ${this.props.accessToken}` }
        };

        axios.get<KleppVideoResponse>("https://api.klepp.me/api/v1/files", config).then(res => {
            this.setState({
                items: res.data.files,
                hiddenItems: res.data.hiddenFiles
            })
        })
    }
    

    renderItems() {
        return this.state.items
            .filter(item => item.uri.endsWith(".mp4")) // Done in aws
            .sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime)).reverse()
            .slice(0, 8) // Remove this to show all items, to save bandwith in debugging..
            .map((item, index) => {
                return (
                    <Grid item={true} xs={2} sm={4}>
                        <Card style={{ marginTop: 10 }} square={true}>
                            <CardContent>
                                <Typography variant="body1">Lastet opp av: {item.username}</Typography>
                                <Typography variant="body2" color='white'>{item.fileName.split("/").pop()}</Typography>
                            </CardContent>
                            <KleppVideoPlayer embedUrl={item.uri} />
                        </Card>
                    </Grid>
                )
            })
    };

    renderOwnItems() {
        return this.state.items
            .filter(item => item.uri.endsWith(".mp4") && item.fileName.includes(this.props.userName!))
            .sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime)).reverse()
            .slice(0, 8) // Remove this to show all items, to save bandwith in debugging..
            .map((item, index) => {
                return (
                    <Grid item={true} xs={2} sm={4}>
                        <Card style={{ marginTop: 20 }} square={true}>
                            <CardContent>
                                <Typography variant="body1">Lastet opp av: {item.username}</Typography>
                                <Typography variant="body2" color='white'>{item.fileName.split("/").pop()}</Typography>
                            </CardContent>
                            <KleppVideoPlayer embedUrl={item.uri} />
                        </Card>
                    </Grid>
                )
            })
    };

    renderHiddenItems() {
        return this.state.hiddenItems
            .filter(item => item.uri.endsWith(".mp4"))
            .sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime)).reverse()
            .slice(0, 8) // Remove this to show all items, to save bandwith in debugging..
            .map((item, index) => {
                return (
                    <Grid item={true} xs={2} sm={4}>
                        <Card style={{ marginTop: 10 }} square={true}>
                            <CardContent>
                                <Typography variant="body1">Lastet opp av: {item.username}</Typography>
                                <Typography variant="body2">{item.fileName.split("/").pop()}</Typography>
                            </CardContent>
                            <KleppVideoPlayer embedUrl={item.uri} />
                        </Card>
                    </Grid>
                )
            })
    };

    render() {
        if (!this.props.accessToken || !this.props.userName) return (
            <div style={{paddingBottom: 32}}>
                <Typography variant="h3" color="white" sx={{ mt: 16 }}>Nyeste videoer</Typography>
                <div className="videoGrid" style={{ padding: 10, marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                    {this.state.items &&
                        <Grid direction="row" container spacing={2} columns={16}>
                            {this.renderItems()}
                        </Grid >
                    }
                </div>
            </div>
        )
        else return (
            <div style={{paddingBottom: 32}}>
                <div>
                    <Typography variant="h3" color="white" sx={{ mt: 16 }}>Mine videoer</Typography>
                    <div className="privateVideoGrid" style={{ padding: 10, marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                        {this.state.items &&
                            <Grid direction="row" container spacing={2} columns={16}>
                                {this.renderOwnItems()}
                            </Grid >
                        }
                    </div>
                </div>

                <div>
                    <Typography variant="h3" color="white" sx={{ mt: 16 }}>Mine private videoer</Typography>
                    <div className="privateHiddenVideoGrid" style={{ padding: 10, marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                        {this.state.hiddenItems &&
                            <Grid direction="row" container spacing={2} columns={16}>
                                {this.renderHiddenItems()}
                            </Grid >
                        }
                    </div>
                </div>
            </div>
        )
    }
}
