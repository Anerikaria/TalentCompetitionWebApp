import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import {  Pagination, Button, Icon, Dropdown, Checkbox, Accordion,Label, Form, Segment } from 'semantic-ui-react';


export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        console.log(loader);
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            filteredJobs: [],
            loaderData: loader,
            activePage: 1,
            selectedTitle: "",
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleTitleSelect = this.handleTitleSelect.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleDatesAsc = this.handleDatesAsc.bind(this);
        this.handleDatesDec = this.handleDatesDec.bind(this);
        this.handleClick = this.handleClick.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        //this.setState({ loaderData });
        //comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
          
        )
               //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();

    };

    handlePaginationChange(e, { activePage }) {
        this.loadNewData({ activePage: activePage });
    }

    handleFilter(e, { checked, name }) {
        let title = e.target.innerText;
        const all = this.state.loadJobs.slice()
        const filteredJobs = all.filter(data => data.title === title)
        this.state.filter[name] = checked;
        this.setState({
            filteredJobs,
            filter: this.state.filter
        })
        
    }

    handleDatesAsc() {
        const dates = this.state.filteredJobs.slice();
        const sortedDates = dates.sort((a, b) => {
            return new Date(a.expiryDate) - new Date(b.expiryDate);
        });
        this.setState({
            filteredJobs: sortedDates
        })
    }

    handleDatesDec() {
        const dates = this.state.filteredJobs.slice();
        const sortedDates = dates.sort((a, b) => {
            return new Date(b.expiryDate) - new Date(a.expiryDate);
        });
        this.setState({
            filteredJobs: sortedDates
        })

    }

    handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }


    handleReset()  {
        this.setState({

            filteredJobs: this.state.loadJobs
        })
    };

    handleTitleSelect (e, { value })  {
        this.setState({
            selectedTitle: value
        });
    }
        

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                activePage: this.state.activePage,
                sortByDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                this.setState({
                    loadJobs: res.myJobs,
                    filteredJobs: res.myJobs,
                    totalPages: Math.ceil(res.totalCount / 3)
                }, callback);
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }.bind(this)
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        //let jobOptions = this.state.loadJobs.map && this.state.loadJobs.map((option, index) => (
        //    <Dropdown.Item key={index} onClick={() => this.handleFilter(option.title)}>
        //        {option.title}
        //    </Dropdown.Item>
        //))
       
           return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <span>
                        <Icon aria-hidden="true" className="filter" />{"Filter:"}
                        <Dropdown inline simple text="Choose filter" >
                               <Dropdown.Menu >
                                   <Dropdown.Item value="All data" onClick={this.handleReset}>
                                      All Jobs
                                   </Dropdown.Item >
                                   <Dropdown.Item value="Software Developer" onClick={this.handleFilter}>
                                      Software Developer
                                   </Dropdown.Item>
                                   <Dropdown.Item value="Test Analyst" onClick={this.handleFilter} >
                                       Test Analyst
                                   </Dropdown.Item>
                                   <Dropdown.Item value="Business Intelligence" onClick={this.handleFilter}>
                                       Business Intelligence
                                   </Dropdown.Item>
                                   <Dropdown.Item key={"status"}>
                                       <Accordion>
                                           <Accordion.Title active={this.state.activeIndex === 1} index={1} onClick={this.handleClick}>
                                               <Icon name='dropdown' />
                                               By Status
                                           </Accordion.Title>
                                           <Accordion.Content active={this.state.activeIndex === 1}>
                                               <Form>
                                                   <Form.Group grouped>
                                                       <Form.Checkbox label='Active Jobs'
                                                           name="showActive" onChange={this.handleFilter} checked={this.state.filter.showActive} />
                                                       <Form.Checkbox label='Closed Jobs'
                                                           name="showClosed" onChange={this.handleFilter} checked={this.state.filter.showClosed} />
                                                       <Form.Checkbox label='Drafts'
                                                           name="showDraft" onChange={this.handleFilter} checked={this.state.filter.showDraft} />
                                                   </Form.Group>
                                               </Form>
                                           </Accordion.Content>
                                       </Accordion>
                                   </Dropdown.Item>
                                   <Dropdown.Item key={"expiryDate"}>
                                       <Accordion>
                                           <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
                                               <Icon name='dropdown' />
                                               By Expiry Date
                                           </Accordion.Title>
                                           <Accordion.Content active={this.state.activeIndex === 0}>
                                               <Form>
                                                   <Form.Group grouped>
                                                       <Form.Checkbox label='Expired Jobs'
                                                           name="showExpired" onChange={this.handleFilter} checked={this.state.filter.showExpired} />
                                                       <Form.Checkbox label='Unexpired Jobs'
                                                           name="showUnexpired" onChange={this.handleFilter} checked={this.state.filter.showUnexpired} />
                                                   </Form.Group>
                                               </Form>
                                           </Accordion.Content>
                                       </Accordion>
                                   </Dropdown.Item>

                               </Dropdown.Menu>
                           </Dropdown>
                           <Icon aria-hidden="true" className="calendar alternate outline" />{"Sort by Date:"}
                           <Dropdown inline simple text="All Dates">
                               <Dropdown.Menu>
                                   <Dropdown.Item onClick={this.handleDatesAsc}>
                                       Newest First
                                   </Dropdown.Item>
                                   <Dropdown.Item onClick={this.handleDatesDec}>
                                       Oldest First
                                   </Dropdown.Item>
                               </Dropdown.Menu>
                           </Dropdown>
                    </span>
                       <br />
                    <br/>
                       <div>
                           {this.state.filteredJobs.length > 0 ? <JobSummaryCard jobs={this.state.filteredJobs} /> : 'No Jobs Found'}
                       </div>
                       <div className="centered">
                           <Pagination
                               ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                               firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                               lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                               prevItem={{ content: <Icon name='angle left' />, icon: true }}
                               nextItem={{ content: <Icon name='angle right' />, icon: true }}
                               activePage={this.state.activePage}
                               totalPages={this.state.totalPages}
                               onPageChange={this.handlePaginationChange}

                           />
                       </div>
                       <br />
                       <br/>
                   </div>
            </BodyWrapper>
        )
    }
}


//class SegmentJob extends React.Component{
//    render() {
//        const { jobs } = this.props;
//        return (
//            <div>
//                <Grid columns={3}>
//                {jobs.map(job => (
//                    console.log(job),
//                    <Grid.Column key={job.id}>
//                            <Card style={{ width: '500px', height: '340px', marginBottom: '70px' }} >
//                                <Card.Content>
//                                     <div>
//                                        <h3>{job.title}</h3>
//                                        <Card.Meta>{job.location.city}, {job.location.country}</Card.Meta><br />
//                                    <p>{job.summary}</p>
//                                    </div>
//                                    <Label color='black' ribbon='right' ><Icon className='user'> 0 </Icon></Label>
//                                </Card.Content>
//                                <Card.Content extra>
//                                    <button className="ui red small button" >Expired</button>
//                                    <Button.Group width='1' className="ui  blue basic button " floated='right'>
//                                        <Button size='tiny' ><Icon className="ban"></Icon>Close</Button>
//                                        <Button ><Icon className="edit"></Icon>Edit</Button>
//                                        <Button ><Icon className="copy outline"></Icon>Copy</Button>
//                                    </Button.Group>
//                                </Card.Content>
//                            </Card>
//                        </Grid.Column>
//                ))}
//                </Grid>
//            </div>

//        )
//    }
//}