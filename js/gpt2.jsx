import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/common.css';
import '../css/gpt2.css';

const axios = require('axios').default;


class GPT2App extends React.Component {
    state = {
        results: "",
        loading: false,
    }
    render() {
        var handleSubmit = function(event) {
            event.preventDefault();
            const form = event.target.elements;

            const json = JSON.stringify({
                GPT2Prompt: form.GPT2Prompt.value
            });
            const params = {
                headers: {'Content-Type': 'application/json'}
            };
            this.setState({ loading: true })
            axios.post('http://0.0.0.0:3000/api/gpt2', json, params)
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
                <h2>GPT-2 Query</h2>
                <Form className="gpt2-form" noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="GPT2Prompt">
                        <Form.Label>Prompt</Form.Label>
                        <Form.Control as="textarea" rows={5} />
                    </Form.Group>
                    <Row>
                        <Button type="submit" variant="primary">Submit</Button>
                        <Spinner hidden={!this.state.loading} animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Row>
                </Form>
                <div className="gpt2-result">{this.state.results}</div>
            </div>
        );
    }
}

ReactDOM.render(<GPT2App />, document.getElementById('gpt2-app'));
