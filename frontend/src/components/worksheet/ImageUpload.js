import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography } from '@material-ui/core';
import AvatarResizeModal from '../AvatarResizeModal';
import { endpoint, SUPPORTED_FORMATS } from '../../config';

const styles = theme => ( {
  button: {
    marginTop: theme.spacing.unit,
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  wrongFileError: {
    color: theme.palette.error.main,
  }
} );

class ImageUpload extends React.Component {
  state = {
    modalIsOpen: false,
    imageInput: '',
    imageFile: '',
    imageUrl: '',
    imageInvalid: false,
  };

  onCloseModal = () => {
    this.setState({ modalIsOpen: false, imageInput: '', imageFile: '' });
  };

  onSaveModal = async (image) => {
    let data = new FormData();
    data.append('data', image, `worksheet-cover-${Date.now().toString()}.jpeg`);

    try {
      const uploadedImage = await axios.post(`${endpoint}/upload`, data,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      //set image url to Formik
      this.props.onChange(this.props.name, uploadedImage.data.file);

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
    const { classes, label, height, width, borderRadius } = this.props;
    let uploadInput = null;

    return (
      <div>
        <input type="file"
               accept="image/*"
               onChange={e => this.avatarOnChange(e)}
               ref={ref => uploadInput = ref}
               style={{ display: 'none' }}/>

        <Button variant="outlined"
                className={classes.button}
                aria-label={label}
                onClick={e => uploadInput.click()}
                color="primary">
          {label}
          <CloudUploadIcon className={classes.rightIcon}/>
        </Button>

        {this.state.imageInvalid &&
        <Typography variant="caption"
                    className={classes.wrongFileError}>Csak képet tölthetsz fel!</Typography>}

        {this.state.modalIsOpen && <AvatarResizeModal
          open={this.state.modalIsOpen}
          onClose={this.onCloseModal}
          image={this.state.imageFile}
          onSave={this.onSaveModal}
          imageWidth={width}
          imageHeight={height}
          borderRadius={borderRadius}
        />}
      </div>
    );
  }
}

ImageUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  borderRadius: PropTypes.number,
};

ImageUpload.defaultProps = {
  borderRadius: 0,
};

export default withStyles(styles)(ImageUpload);