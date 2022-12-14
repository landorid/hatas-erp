import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import gql from 'graphql-tag';
import axios from 'axios';
import { withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/es/Typography/Typography';
import TextField from '@material-ui/core/TextField';
import { CURRENT_USER_QUERY } from '../User';
import AvatarResizeModal from '../AvatarResizeModal';
import FormContainer from './elements/FormContainer';
import ErrorMessage from './UserForm';
import { endpoint, SUPPORTED_FORMATS } from '../../config';

const UPLOAD_AVATAR_MUTATION = gql`
  mutation UPLOAD_AVATAR_MUTATION($image: String!) {
    changeAvatar(image: $image) {
      id
      avatar
    }
  }
`;

const styles = (theme) => ( {
  root: {
    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
    },
  },
  avatar: {
    margin: '0 auto',
    width: 100,
    height: 100,
    fontSize: '40px',
    [theme.breakpoints.up('sm')]: {
      margin: 10,
    },
  },
} );

const Composed = adopt({
  userImage: ({ render }) => <Query query={CURRENT_USER_QUERY} children={render}/>,
  saveImage: ({ render }) => <Mutation mutation={UPLOAD_AVATAR_MUTATION}>
    {(mutation, result) => render({ mutation, result })}
  </Mutation>,
});

class AvatarForm extends Component {
  state = {
    modalIsOpen: false,
    imageInput: '',
    imageFile: '',
    imageUrl: '',
    imageInvalid: false
  };

  onCloseModal = () => {
    this.setState({ modalIsOpen: false, imageInput: '', imageFile: '' });
  };

  onSaveModal = async (image, { mutation, result }, userId) => {
    let data = new FormData();
    data.append('data', image, `${userId}-${Date.now().toString()}.jpeg`);

    try {
      //We need to withCredentials to send cookies (token) to server
      const uploadedImage = await axios.post(`${endpoint}/upload`, data,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      await mutation({
        variables: { image: uploadedImage.data.file },
        update: (cache) => {
          const data = cache.readQuery({ query: CURRENT_USER_QUERY });
          data.me.avatar = uploadedImage.data.file;
          cache.writeQuery({ query: CURRENT_USER_QUERY, data });
        },
      });
      this.setState({ imageUrl: uploadedImage.data.file, modalIsOpen: false, imageInput: '' });
    } catch (e) {
      console.log(e);
    }
  };

  avatarOnChange = (e) => {
    e.persist();
    if (e.target.files[0] === undefined) {
      return;
    }

    if (!SUPPORTED_FORMATS.includes(e.target.files[0].type)) {
      this.setState({ imageInvalid: true });
      return;
    }

    this.setState({ modalIsOpen: true, imageFile: e.target.files[0], imageInvalid: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <FormContainer>
        <Composed>
          {({ userImage, saveImage }) => {
            if (saveImage.result.error) return <ErrorMessage error={saveImage.result.error}/>;

            return (
              <Grid container>
                <Grid xs={12} md={3} item>
                  <Avatar alt="Felhaszn??l?? profilk??pe" src={this.state.imageUrl || userImage.data.me.avatar}
                          className={classes.avatar}>
                    {userImage.data.me.lastName[0] + userImage.data.me.firstName[0]}
                  </Avatar>
                </Grid>
                <Grid xs={12} md={9} item className={classes.root}>
                  <Typography variant="h6">Profilk??p felt??lt??se</Typography>
                  <TextField
                    type="file"
                    name="avatar"
                    margin="normal"
                    variant="outlined"
                    error={this.state.imageInvalid}
                    helperText={this.state.imageInvalid && 'Csak k??pet t??lthetsz fel!'}
                    value={this.state.imageInput}
                    onChange={this.avatarOnChange}
                  />
                </Grid>
                {this.state.modalIsOpen && <AvatarResizeModal
                  open={this.state.modalIsOpen}
                  onClose={this.onCloseModal}
                  image={this.state.imageFile}
                  imageWidth={250}
                  imageHeight={250}
                  borderRadius={125}
                  onSave={(image) => this.onSaveModal(image, saveImage, userImage.data.me.id)}
                />}
              </Grid>
            );
          }}
        </Composed>
      </FormContainer>
    );
  }
}

export default withStyles(styles)(AvatarForm);