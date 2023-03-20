import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Grid, Card, Button, Icon, Label, Pagination } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:51689/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: "post",
            data: JSON.stringify(id),
            success: function (res) {
                if (res.success == true) {
                    console.log(res)
                    TalentUtil.notification.show(res.message, "success", null, null)
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }
            }.bind(this)
        })
    }

        render() {
            const { jobs } = this.props;
            return (
                <div>
                    <Grid columns={3}>
                        {jobs.map(job => (
                            console.log(job),
                            <Grid.Column key={job.id}>
                                <Card style={{ width: '350px', height: '300px', marginBottom: '70px' }} >
                                    <Card.Content>
                                        <div>
                                            <h3>{job.title}</h3>
                                            <Card.Meta>{job.location.city}, {job.location.country}</Card.Meta><br />
                                            <p>{job.summary}</p>
                                        </div>
                                        <Label color='black' ribbon='right' ><Icon className='user'> 0 </Icon></Label>
                                    </Card.Content>
                                        <Card.Content extra>
                                            <button className="ui red small button">Expired</button>
                                            <Button.Group className="ui mini basic blue buttons" floated='right'>
                                                <Button onClick={() => this.selectJob(job.id)}><Icon className="ban" ></Icon>Close</Button>
                                                <Button onClick={() => { window.location = "/EditJob/" + job.id }}><Icon className="edit"></Icon>Edit</Button>
                                                <Button onClick={() => { window.location = "/PostJob/" + job.id }}><Icon className="copy outline"></Icon>Copy</Button>
                                            </Button.Group>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        ))}
                    </Grid>
                </div>

            )
        }

    
}