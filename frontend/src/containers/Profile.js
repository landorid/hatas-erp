import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import PageTitle from '../components/PageTitle';
import UserForm from '../components/form/UserForm';
import ChangePassword from '../components/form/ChangePassword';

class Profile extends Component {
  state = {
    activeTab: 0,
  };

  handleChange = (event, activeTab) => {
    this.setState({ activeTab });
  };

  render() {
    const { activeTab } = this.state;
    return (
      <div>
        <PageTitle title="Profil szerkesztése"/>
        <AppBar position="static" color="inherit">
          <Tabs value={activeTab} onChange={this.handleChange} indicatorColor="primary" textColor="primary">
            <Tab label="Általános"/>
            <Tab label="Profilkép"/>
            <Tab label="Jelszó módosítás"/>
          </Tabs>
        </AppBar>
        {activeTab === 0 && <UserForm/>}
        {activeTab === 2 && <ChangePassword/>}
      </div>
    );
  }
}

export default Profile;