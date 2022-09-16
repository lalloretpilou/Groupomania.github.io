import React from 'react';
import PropTypes from 'prop-types';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';
import dayjs from 'dayjs';
import axios from 'axios';
import './index.css';

const Post = (props) => {

  const [isEdited, setIsEdited] = React.useState(props.name === "" && props.description === ""); // true if it's a new post , false otherwise
  const [isNewPost, setIsNewPost] = React.useState(props.name === "" && props.description === "");

  const [name, setName] = React.useState(props.name);
  const [description, setDescription] = React.useState(props.description);
  const [imageURL, setImageURL] = React.useState(props.imageURL);
  const [fileUploaded, setFileUploaded] = React.useState(null);
  
  const nameRef = React.useRef();
  const descriptionRef = React.useRef();
  const imageURLRef = React.useRef();

  const isLiked = () => {
    return props.userLiked.includes(localStorage.getItem('userId'));
  }

  const isOwn = () => {
    return (
      props.userId === localStorage.getItem('userId') || 
      localStorage.getItem('userId') === "62d57f71fe167faf6133d10b"
    );
  }

  const newPost = (name, description, fileUploaded) => {

    let formData = new FormData();
    formData.append('Content-Type', "multipart/form-data");
    formData.append('_id', props.postId);
    formData.append('userId', props.userId);
    formData.append('image', fileUploaded);
    formData.append('name', name);
    formData.append('description', description);

    axios.post(`http://localhost:4000/api/posts`, formData,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      console.log(res.status)
      if (res.status === 201) {
        console.log(`The post has been successfully created`);
        props.onUpdatePost({
          postId: props.postId,
          name: name,
          description: description,
          createdAt: props.createdAt,
          imageURL: res.data.imageURL,
        });
        setImageURL(res.data.imageURL);
        setIsEdited(false);
      }
    })
    .catch((err) => {
      console.log(err);
    });
    return;
  
  }

  const editPost = (name, description, fileUploaded) => {
    
    let formData = new FormData();
    formData.append('image', fileUploaded);
    formData.append('name', name);
    formData.append('createdAt', props.createdAt);
    formData.append('description', description);

    axios
      .put(`http://localhost:4000/api/posts/${props.postId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(`The post has been successfully updated`);
          alert("Le post a bien été mis à jour")
          props.onUpdatePost({
            postId: props.postId,
            name: name,
            description: description,
            createdAt: props.createdAt,
            imageURL: res.data.imageURL,
          });
          setImageURL(res.data.imageURL);
          setIsEdited(false);
        }
      })
      .catch((err) => {
        setIsEdited(false);

        console.log(err);
      });
  }
  const onLikePost = () => {
    axios({
      method: 'put',
      url: `http://localhost:4000/api/posts/${props.postId}/like`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        userId: props.userId,
        like: true,
      },
    })
      .then((res) => {
        if (res.status === 201) {
          console.log(`You like the like`);
          props.onLikePost(props.postId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const onDislikePost = () => {
    axios({
      method: 'put',
      url: `http://localhost:4000/api/posts/${props.postId}/like`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        userId: props.userId,
        like: false,
      },
    })
      .then((res) => {
        if (res.status === 201) {
          console.log(`You dislike the post`);
          props.onDislikePost(props.postId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const deletePost = () => {
    axios({
      method: 'delete',
      url: `http://localhost:4000/api/posts/${props.postId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(`The post has been successfully deleted`);
          props.onDelete(props.postId);
          
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className={props.className}>
      {isEdited ? (
        <input
          className="input title"
          placeholder='Titre du post'
          ref={nameRef}
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        <div className='headerPost'>
        <p className="title">{name}</p>
        <p className="date"> Crée le {dayjs(props.createdAt).format('DD/MM/YYYY')}</p>
        </div>
      )}
      {isEdited ? (
        <textarea
          className="input description"
          placeholder='Description du post'
          ref={descriptionRef}
          value={description}
          rows="5"
          type="textarea"
          onChange={(e) => setDescription(e.target.value)}
        />
      ) : (
        <p className="description">{description}</p>
      )}
      {isEdited ? (
        <input
          className="input imageURL"
          ref={imageURLRef}
          type="file"
          onChange={(e) => setFileUploaded(e.target.files[0])}
        />
      ) : imageURL ? (
        <img className="imageURL" src={imageURL} title = {imageURL} alt = {imageURL}></img>
      ) : null}

{isEdited && isNewPost &&(
        <>
          <div
            className="createPostButton"
            onClick={() => newPost(name, description, fileUploaded)}
            title= "créer un post"
          >
            Créer
          </div>
        </>
      )}
      {isEdited && !isNewPost &&(
        <>
          <div
            className="createPostButton"
            onClick={() => editPost(name, description, fileUploaded)}
            title= "créer un post"
          >
            Mettre à jour
          </div>
        </>
      )}

      <div className='buttonDiv'>
      {isLiked() && !isEdited ? (
        <AiFillHeart onClick={onDislikePost} className="likeButton"
        title= "Je n'aime pas le post"
        />
      ) : !isEdited ? (
        <AiOutlineHeart onClick={onLikePost} className="likeButton" 
        title= "J'aime le post"
        />
      ) : null}

      {isOwn() && !isEdited && (
        <BsFillTrashFill onClick={deletePost} className="trashButton" 
        title= "Je supprime le post"
        />
      )}
      {isOwn() && !isEdited && (
        <BsPencil onClick={() => {setIsEdited(true)
          setIsNewPost(false)}
        }  className="pencilButton" 
        title= "Je modifie le post"
        />
      )}
      </div>
    </div>
  );
}

Post.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string,
  postId: PropTypes.string,
  name: PropTypes.string,
  imageURL: PropTypes.string,
  description: PropTypes.string,
  createdAt: PropTypes.number,
  likes: PropTypes.number,
  userLiked: PropTypes.arrayOf(PropTypes.string),
  onLikePost: PropTypes.func,
  onDislikePost: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdatePost: PropTypes.func,
};

export default Post;
