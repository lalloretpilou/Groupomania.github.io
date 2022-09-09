import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/post';
import { mongoObjectId } from '../utils';
import './homePage.css';

function HomePage(props) {
  const [posts, setPosts] = React.useState([]); // state pour pouvoir mettre à jour l'affichage des posts
  const navigate = useNavigate();

  // Va être appelé à chaque fois que la variable d'état posts est modifié
  React.useEffect(() => {
  }, [posts])

  React.useEffect(() => {
    if (!localStorage.getItem('token') || !localStorage.getItem('userId')) {
      navigate('./login');
    }
    axios({
      method: 'get',
      url: 'http://localhost:4000/api/posts',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setPosts(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleUpdatePost = ({ postId, name, description, imageURL }) => {
    setPosts(
      posts.map((post) => {
        if (post._id === postId) {
          return { ...post, name, description, imageURL };
        }
        return post;
      })
    );
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  const handleLikePost = (postId) => {
    setPosts(
      posts.map((post) => {
        if (postId === post._id) {
          return {
            ...post,
            like: true,
            usersLiked: [...post.usersLiked, localStorage.getItem('userId')],
          };
        }
        return post;
      })
    );
  };
  const handleDislikePost = (postId) => {
    setPosts(
      posts.map((post) => {
        if (postId === post._id) {
          return {
            ...post,
            like: false,
            usersLiked: post.usersLiked.filter(
              (userId) => userId !== localStorage.getItem('userId')
            ),
          };
        }
        return post;
      })
    );
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('./login');
  };

  const createPost = () => {
    setPosts([
      {
        _id: mongoObjectId(),
        userId: localStorage.getItem('userId'),
        name: '',
        description: '',
        imageUrl: '',
        likes: 0,
        usersLiked: [],
      },
      ...posts,
    ]);
  };

  return (
    <>
    <div className="buttonDiv">
      <div className="logoutButton" onClick={logout} title = 'Se déconnecter'>
       Se déconnecter
      </div>

      <div className="createPostButton" onClick={createPost} title = 'Créer un post'>
        + Créer un post
      </div>
      </div>
      <div className='postDisp'>
      {posts.sort(
        (post1, post2) =>
          post2.createdAt - post1.createdAt
      )    
        .map((post, i) => (
          <Post
            name={post.name}
            className="post"
            description={post.description}
            createdAt={post.createdAt}
            imageURL={post.imageUrl}
            likes={post.likes}
            postId={post._id}
            userId={post.userId}
            key={post._id}
            userLiked={post.usersLiked}
            onLikePost={handleLikePost}
            onDislikePost={handleDislikePost}
            onDelete={handleDeletePost}
            onUpdatePost={handleUpdatePost}
          />
        ))}
        </div>
    </>
  );
}

HomePage.propTypes = {};

export default HomePage;
