import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/common.css';
import '../css/t5.css';

const axios = require('axios').default;


class T5App extends React.Component {
    state = {
        results: "",
        loading: false,
    }
    render() {
        var handleSubmit = function(event) {
            event.preventDefault();
            const form = event.target.elements;

            const json = JSON.stringify({
                T5QueryType: form.T5QueryType.value,
                T5Prompt: form.T5Prompt.value
            });
            const params = {
                headers: {'Content-Type': 'application/json'}
            };
            this.setState({ loading: true })
            axios.post('http://0.0.0.0:3000/api/t5', json, params)
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
                <h2>T5 Query</h2>
                <Form className="t5-form" noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="T5QueryType">
                        <Form.Label>Query type</Form.Label>
                        <Form.Control className="t5-query-type-dropdown" as="select">
                            <option value="summarize">summarize</option>
                            <option value="translate">translate English to German</option>
                            <option value="cola">CoLA</option>
                            <option value="stsb">STSB</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="T5Prompt">
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
                <div className="t5-result">{this.state.results}</div>
            </div>
        );
    }
}

ReactDOM.render(<T5App />, document.getElementById('t5-app'));
