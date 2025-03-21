const express = require('express');
const axios = require('axios'); 
const app = express();
const port = 5000;

//api auth
const authData = {
    "token_type": "Bearer",
    //"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTMzNzg0LCJpYXQiOjE3NDI1MzM0ODQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjgxYzg4ZGFhLTViOWMtNDc3OC04OGU0LWRkMmZlNTg0ZmQ2NSIsInN1YiI6InNlbmR0b2treUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJSZXZhVW5pdmVyc2l0eSIsImNsaWVudElEIjoiODFjODhkYWEtNWI5Yy00Nzc4LTg4ZTQtZGQyZmU1ODRmZDY1IiwiY2xpZW50U2VjcmV0IjoiSlF5WUVZVFZEV3ViSmJydSIsIm93bmVyTmFtZSI6IktyaXNobmFLdW1hciIsIm93bmVyRW1haWwiOiJzZW5kdG9ra3lAZ21haWwuY29tIiwicm9sbE5vIjoiUjIyRUowMzEifQ.-lj8BP7JK11mOAdGrenzWWizbl6Ccq9QoRcBP3SzlPE"
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTM3ODgyLCJpYXQiOjE3NDI1Mzc1ODIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjgxYzg4ZGFhLTViOWMtNDc3OC04OGU0LWRkMmZlNTg0ZmQ2NSIsInN1YiI6InNlbmR0b2treUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJSZXZhVW5pdmVyc2l0eSIsImNsaWVudElEIjoiODFjODhkYWEtNWI5Yy00Nzc4LTg4ZTQtZGQyZmU1ODRmZDY1IiwiY2xpZW50U2VjcmV0IjoiSlF5WUVZVFZEV3ViSmJydSIsIm93bmVyTmFtZSI6IktyaXNobmFLdW1hciIsIm93bmVyRW1haWwiOiJzZW5kdG9ra3lAZ21haWwuY29tIiwicm9sbE5vIjoiUjIyRUowMzEifQ.5ZYhQz4yIikig6MncwBhoj9Ol6geouHMUfhsbzsLmGg"
};

const userListEndpoint = "http://20.244.56.144/test/users";
const postListEndpoint = "http://20.244.56.144/test/users/:userid/posts";



// //endpoint to display the list of users
// app.get('/users', async (req, res) => {
//     try {
//         const response = await axios.get(userListEndpoint, {
//     headers: {Authorization: `${authData.token_type} ${authData.access_token}` }
//         });
//         const users = response.data;
//         res.send(users);//display the list of users
//     } catch (error) {
//         console.error('Error occurred:', error.message);
//     }
// });




//result for question1 for displaying top 5 users with respect to post count at https://localhost:5000/users
app.get('/users', async (req, res) => {
    try {

//fetching all users list
        const userList = await axios.get(userListEndpoint, {
            headers: { Authorization: `${authData.token_type} ${authData.access_token}` }
        });
        const users = userList.data;

//fetching each users posts and counting them
        const user_post_count = await Promise.all(users.map(async (user) => {
            const userPostsEndpoint = postListEndpoint.replace(':userid', user.id);
    try {
                const list_of_all_posts = await axios.get(userPostsEndpoint, {
                    headers: { Authorization: `${authData.token_type} ${authData.access_token}` }
        });


        const post_count = list_of_all_posts.data.posts.length; 
            return { id: user.id, name: user.name, post_count };
     } catch (error) {
                console.error(`error fetching posts for userId no ${user.id}:`, error.message);
                return { id: user.id, name: user.name, post_count: 0 }; 
       }
        }));

//sorted in descending order
        user_post_count.sort((a, b) => b.post_count - a.post_count);

//extracting top 5 users
        const top5Users = user_post_count.slice(0, 5);

//display the result
        res.send(top5Users);


    } catch (error) {
    res.send('error fetching top5users');
    }
});



//endpoint to check if the backend is running
app.get('/test', (req, res) => {
    res.send('Backend is running');
});

//start the server
app.listen(port, () => {
    console.log(`server running at link http://localhost:${port}`);
});