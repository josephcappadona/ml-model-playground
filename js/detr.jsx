import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/common.css';
import '../css/detr.css';

const axios = require('axios').default;


class DETRApp extends React.Component {
    state = {
        imageData: "",
        results: "",
        loading: false,
    }
    render() {
        var uploadFile = function(event) {
            console.log(event);
            const files = event.target.files;
            console.log(files[0]);

            var read = new FileReader();
            read.onloadend = function(){
                console.log(read.result);
                this.setState({ imageData: read.result });
            }.bind(this);
            read.readAsDataURL(files[0]);
        }.bind(this);

        var handleSubmit = function(event) {
            event.preventDefault();
            const form = event.target.elements;

            const json = JSON.stringify({
                DETRimage: form.DETRimage.files[0],
                DETRurl: form.DETRurl.value
            });
            console.log(form.DETRimage);
            const params = {
                headers: {'Content-Type': 'application/json'}
            };
            this.setState({ loading: true })
            axios.post('http://0.0.0.0:3000/api/detr', json, params)
                .then(response => {
                    this.setState({
                        results: response.data.data,
                        loading: false
                    });
                    console.log(response.data.data);
            });
        }.bind(this);
        return (
            <div>
                <h2>DETR Query</h2>
                <Form className="detr-form" noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="DETRurl">
                        <Form.Label>URL</Form.Label>
                        <Form.Control as="textarea" rows={1} />
                    </Form.Group>
                    <Form.Group controlId="DETRimage" onChange={uploadFile}>
                        <Form.File label="Upload image" />
                    </Form.Group>
                    <Row>
                        <Button type="submit" variant="primary">Submit</Button>
                        <Spinner hidden={!this.state.loading} animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Row>
                </Form>
                <div className="detr-result">{this.state.results}</div>
            </div>
        );
    }
}

ReactDOM.render(<DETRApp />, document.getElementById('detr-app'));
