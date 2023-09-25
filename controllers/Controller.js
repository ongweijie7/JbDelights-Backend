const express = require('express');
const submissions = require("../model/submissions");

const getPosts = (req, res, model) => {
    model.find()
        .then((result) => {
            return res.json({ posts: result });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        });
} 

const getPostDetails = (req, res, model) => {
    const fetchData = async (postId) => {
        try {
            const postDetails = await model.findById(postId);
            return postDetails;
        } catch (error) {
            console.log(error);
        }
    }
    // TODO: standardise format of responses
    fetchData(req.params.id).then(result => res.send(result)); 
}

const createSubmissions = (req, res, category) => {
    const parsedBody = req.body;
    parsedBody.tag = category;
    submissions.create(parsedBody)
    .then(result => res.json({text: "successfully added!"}))
    .catch(error => res.status(400));
}

module.exports= { getPosts, getPostDetails, createSubmissions }