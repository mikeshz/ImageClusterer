import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from 'react-grid-gallery';

class Recluster extends React.Component {
    handleClick() {
        console.log("plz");
        console.log("ayy " + this.props.selectedImages);
    }

    componentDidMount() {
        fetch(`http://www.reddit.com/r/${this.props.selectedImages}.json`)
            .then(res => {
                const posts = res.data.data.children.map(obj => obj.data);
                this.setState({ posts });
            });
    }

    render() {
        return (
            <div>
                <h1>{`/r/${this.props.subreddit}`}</h1>
                <ul>
                    {this.state.posts.map(post =>
                        <li key={post.id}>{post.title}</li>
                    )}
                </ul>
            </div>
        );
    }
}


class ImageClusterer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            images: [],
            selectAllChecked: false
        };
        this.onSelectImage = this.onSelectImage.bind(this);
        this.getSelectedImages = this.getSelectedImages.bind(this);
    }

    componentDidMount() {
        fetch('//localhost:3001/api/getimages', {headers: {"Content-Type": "application/json"}})
            .then(results => {
                return results.json();
            }).then(data => {
                var imagesArray = {"images": [data["images"].length]};
                for (var i = 0; i < data["images"].length; i++) {
                    imagesArray["images"][i] = {
                        "src": "data:image/png;base64," + data["images"][i]["src"],
                        "thumbnail": "data:image/png;base64," + data["images"][i]["thumbnail"],
                        "thumbnailWidth": 300,
                        "thumbnailHeight": 170
                    }
                }
                this.setState(imagesArray);
            })
    }

    allImagesSelected (images){
        var f = images.filter(
            function (img) {
                return img.isSelected == true;
            }
        );
        return f.length == images.length;
    }

    onSelectImage (index, image) {
        var images = this.state.images.slice();
        var img = images[index];
        if(img.hasOwnProperty("isSelected"))
            img.isSelected = !img.isSelected;
        else
            img.isSelected = true;

        this.setState({
            images: images
        });

        if(this.allImagesSelected(images)){
            this.setState({
                selectAllChecked: true
            });
        }
        else {
            this.setState({
                selectAllChecked: false
            });
        }
    }

    getSelectedImages () {
        var selected = [];
        for(var i = 0; i < this.state.images.length; i++)
            if(this.state.images[i].isSelected == true)
                selected.push(i);
        return selected;
    }

    render () {
        return (
            <div>
                <div style={{
                    padding: "2px",
                    color: "#666"
                }}>Selected images: {this.getSelectedImages().toString()}</div>
            <div>
                <button onClick={Recluster}>Recluster Images</button>
            </div>
            <div style={{
                display: "block",
                minHeight: "1px",
                width: "1000px",
                border: "1px solid #ddd",
                overflow: "none"}}>
                <Gallery
                    images={this.state.images}
                    onSelectImage={this.onSelectImage}
                    showLightboxThumbnails={true}/>
            </div>
        </div>
        );
    }
}

ReactDOM.render(<ImageClusterer />, document.getElementById('root'));
