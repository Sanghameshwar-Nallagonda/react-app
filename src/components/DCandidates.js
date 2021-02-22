import React, { useState, useEffect, useRef  } from "react";
import { connect } from "react-redux";
import * as actions from "../actions/dCandidate";
import { Grid, Paper, TableContainer, TextField,Table, TableHead, TableRow, TableCell, TableBody, withStyles, ButtonGroup, Button } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

//change the port if your service runing on the different port.
const baseUrl = "http://localhost:62786/api/"


const styles = theme => ({
    root: {
        "& .MuiTableCell-head": {
            fontSize: "1.25rem"
        }
    },
    paper: {
        margin: theme.spacing(3),
        padding: theme.spacing(3)
    }
})
const mklop = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 800,
    height: 550,
  },
}));

export function ImageGridList(tileData) {
    const classes = mklop();
    if (tileData != null && tileData.length >= 1) {
        return (
            <div className={classes.root}>
                <GridList cellHeight={160} className={classes.gridList} cols={3}>
                    {tileData.map((tile) => (
                        <GridListTile key={tile.img} cols={tile.cols || 1}>
                            <img src={tile} alt="" key={tile} />
                            {console.log("sangham ......"+{tile})}
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        );
    }
}
const DCandidates = ({ classes, ...props }) => {
    const [currentId, setCurrentId] = useState(0)
    const [selectedFile, setFile] = useState("https://dirico.io/wp-content/uploads/2020/11/dirico_logo-OpenGraph.png");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesObj, setSelectedFilesList] = useState([]);
    const [nodeTest, setNodeTest] = useState();
    const [nodename, setText] = useState();
    const [treeObj, setTree] = useState();
    const [node, setNode] = useState();
    const [id, setID] = useState(-1);
    const handleClick = (treeItemData) => {
        console.log(treeItemData);
        nodename = treeItemData;
    };
    useEffect(() => {
        props.fetchAllDCandidates()
        setText(nodename);    
    }, [])    
    
    const { addToast } = useToasts()

    const getTreeItemsFromData = treeItems => {
        return treeItems.map(treeItemData => {
            let children = undefined;
            if (treeItemData.Nodes && treeItemData.Nodes.length > 0) {
                children = getTreeItemsFromData(treeItemData.Nodes);
            }
            return (
                <TreeItem
                    key={treeItemData.Id}
                    nodeId={treeItemData.Id}
                    label={treeItemData.Name}
                    children={children}
                    Asset={treeItemData.Asset}
                    onClick={() => { setSelectedFilesList(); setSelectedFiles(); setFile(); setText(treeItemData.Asset); setNode(treeItemData); setID(treeItemData.Id); getImages(treeItemData.Id) }}
                />
            );
        });
    };
    function makeGetRequest(path) {
        axios.get(path).then(
            (response) => {
                var result = response.data;
                setSelectedFilesList(result);
                console.log(result);
            },
            (error) => {
                console.log(error);
            }
        );
    }
    const [images, setImages] = React.useState()
    const getImages = (id) => {       
        let imageBlob
        try {
          
        } catch (err) {
            return null
        }
        makeGetRequest(baseUrl + "AssetsTree/getimages/" + id);        
    }

    const createNode = (nodename, propObj, node) => {
        console.log(nodename)
        return (
                    
            <Button variant="contained" style = {{width: 200}}
                color="primary" className={classes.smMargin} onClick={() => {
                    console.log(node);
                    const onSuccess = () => {
                        addToast("Submitted successfully", { appearance: 'success' })
                    }
                    node.name = nodeTest;
                    console.log(nodeTest);
                    props.createDCandidate(node, onSuccess)
                    props.fetchAllDCandidates();
                    console.log(propObj)
                    setNodeTest("");
                    setTree(...[propObj])
                }}>Create Directory</Button>
           
        )
    }


    const imagevalue = (nodename, propObj, node) => {
        console.log(nodename)
        //if (nodename !== null)
        return (
                    
            <Button variant="contained" style = {{width: 200}}
                color="secondary" className={classes.smMargin} onClick={() => {
                    
                    //setText(...propObj, node.Asset = "No Image");
                    //console.log(propObj)
                    if (window.confirm('Are you sure to delete this record?'))
                        props.deleteDCandidate(id, () =>
                            addToast("Deleted successfully", { appearance: 'info' }
                                //setTree(...props)
                             
                            ))
                    setFile();
                    setSelectedFilesList();
                    props.fetchAllDCandidates();
                    console.log(propObj)
                    setTree(...[props])
                    
                    // else
                    // {
                    //     addToast("Can not delete the root node...", { appearance: 'info' })
                    // }
                }}>Delete Directory</Button>
           
        )
    }

    const onFileChange = event => {
        if (event.target.files && event.target.files[0]) {
            let imageFile = event.target.files[0];
            console.log("Image file during upload" + imageFile);
            const reader = new FileReader();
            reader.onload = x => {
                console.log("file content" + x.target.result);
                setFile(x.target.result)
            }
            reader.readAsDataURL(imageFile);
        }        
    };    
    const handleMyFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Update the formData object
        formData.append(
            "id",
            id
        );
       
        formData.files = selectedFile;
        // Details of the uploaded file
        console.log(selectedFile);
        
        // formData.append('name', 'Image Upload');
        formData.append('file_attachment', selectedFile);
        // Request made to the backend api
        // Send formData object
        console.log(selectedFile);
        fetch(baseUrl + "AssetsTree/upload", {
            // content-type header should not be specified!
            method: 'POST',
            body: formData
   
        })
            .then(response => { response.json(); addToast("Uploaded successfully", { appearance: 'info' }); })
            .then(success => {                
            })
            .catch(error => console.log(error)
            );        
    }

    const renderPhotos = (source) => {
        console.log('source: ', source);
        const classes2 = mklop();
        
        if (source != null && source.length >= 1) {
            return (
                <div className={classes2.root}>
                    <GridList cellHeight={200} className={classes2.gridList} cols={3}>
                        {source.map((tile) => (
                            <GridListTile key={tile.img} cols={tile.cols || 1}>
                                 <img src={tile} alt="" key={tile} /> 
                                {/* <source src={window.URL.createObjectURL(tile)} type="video/mp4"></source>    */}
                                
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
            );
        }
    };
    const handleImageChange = (e) => {
                


        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));

            // console.log("filesArray: ", filesArray);
            if (filesArray != null) {
                setSelectedFiles(filesArray);
                Array.from(e.target.files).map(
                    (file) => URL.revokeObjectURL(file) // avoid memory leak
                );
            }
            let sF = e.target.files;
            Array.prototype.forEach.call(sF, element => {
                const reader = new FileReader();
                reader.onload = x => {
                    //console.log("file content" + x.target.result);
                    console.log(element.name.replaceAll(/\s+/g, '') + " file content : " + x.target.result);                       
                    const formData = new FormData();
                    // Update the formData object
                    formData.append(
                        "id",
                        id
                    );                         
                    // formData.append('name', 'Image Upload');
                    formData.append('file_attachment', x.target.result);
                    // Request made to the backend api
                    // Send formData object
                    console.log(x.target.result);
                    fetch(baseUrl + "AssetsTree/upload", {
                        // content-type header should not be specified!
                        method: 'POST',
                        body: formData   
                    })
                        .then(response => { response.json(); })
                        .then(success => {
                        })
                        .catch(error => console.log(error)
                        );
                };
                reader.readAsDataURL(element);
            });
            addToast("Uploaded successfully", { appearance: 'info' });
        }
               
    };

    return (
        <div>
            <h2>   Dirico - Asset Management </h2>
            <Paper className={classes.paper} elevation={5}>
                <Grid container direction="row"
                    justify="top"
                    alignItems="top">
                    <Grid item xs={2}>
                        <TreeView
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                        >
                            {getTreeItemsFromData(props.dCandidateList)}
                        </TreeView>
                    </Grid>
                    <Grid item xs={8}>
                        <img src={selectedFile} alt="" />
                        <div className="result">{renderPhotos(selectedFiles)}</div>
                        <div className="result">{renderPhotos(selectedFilesObj)}</div>
                    </Grid>
                    <Grid item xs={2} spacing={8}>
                        <form autoComplete="off" enctype="multipart/form-data" noValidate onSubmit={handleMyFormSubmit}>
                            <Grid item xs={8} spacing={8}>
                                <TextField
                                    id="outlined-basic" variant="outlined"
                                    label="Enter Directory Name"
                                    value={nodeTest}
                                    style = {{width: 200, height: 50}}
                                    onChange={(evt) => {
                                        setNodeTest(evt.target.value);
                                    }
                                    }
                                />
                            </Grid>
                            <Grid item xs={10} spacing={8}>
                                {createNode(nodename, props.dCandidateList, node)}
                            </Grid>
                            <Grid item xs={10} spacing={8}>
                                {imagevalue(nodename, props.dCandidateList, node)}
                            </Grid>
                            <Grid item xs={10} spacing={8}>                                
                                <div>                                    
                                    <Button style = {{width: 200}}
                                        variant="contained"
                                        component="label"
                                    >
                                        Upload Assets
                                        <input
                                            type="file"
                                            id="file" multiple onChange={handleImageChange}
                                            hidden
                                        />
                                    </Button>
                                </div>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );

    
}

const mapStateToProps = state => ({    
    dCandidateList: state.dCandidate.list
})

const mapActionToProps = {
    fetchAllDCandidates: actions.fetchAll,
    deleteDCandidate: actions.Delete,
    updateDCandidate: actions.update,
    createDCandidate: actions.create,
    uploadCandidate: actions.Upload
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DCandidates));