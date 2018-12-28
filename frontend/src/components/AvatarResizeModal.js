import React from 'react';
import PropTypes from 'prop-types';
import ReactAvatarEditor from 'react-avatar-editor';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Slider from '@material-ui/lab/Slider';
import { withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const style = ( {
  slider: {
    width: 250,
    padding: '30px 0',
    margin: '0 auto',
  },
  dialogContent: {
    overflowX: 'hidden',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
} );

class AvatarResizeModal extends React.Component {
  state = {
    zoom: 1,
    loading: false,
  };

  handleChange = (event, zoom) => {
    this.setState({ zoom });
  };

  handleLoading = async (status) => {
    await this.setState({ loading: status });
  };

  handleSave = async () => {
    this.handleLoading(true);
    this.handleChange(null, 1);
    if (this.editor) {
      const canvas = this.editor.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        this.props.onSave(blob);
      });
    }
  };

  setEditorRef = (editor) => this.editor = editor;

  render() {
    const { open, onClose, fullScreen, image, classes } = this.props;

    return (
      <Dialog fullScreen={fullScreen} open={open} onClose={onClose} aria-labelledby="avatar-beallitas">
        <DialogTitle id="avatar-beallitas">Méretezd és pozicionáld a képet megfelelő helyre</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {!this.state.loading &&
          <>
            <ReactAvatarEditor
              ref={this.setEditorRef}
              width={250}
              height={250}
              scale={this.state.zoom}
              image={image}
              border={0}
              borderRadius={125}
            />
            <Slider
              value={this.state.zoom}
              className={classes.slider}
              min={1}
              max={5}
              aria-labelledby="label"
              onChange={this.handleChange}
            />
          </>
          }
          {this.state.loading && <CircularProgress/>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={this.state.loading}>
            Mégsem
          </Button>
          <Button onClick={this.handleSave} color="primary" disabled={this.state.loading} autoFocus>
            Mentés
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

AvatarResizeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
};

export default withStyles(style)(withMobileDialog()(AvatarResizeModal));