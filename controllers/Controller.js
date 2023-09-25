const express = require('express');
const submissions = require("../model/submissions");
const JsonResponse = require('../common/jsonResponse');

const getPosts = (req, res, model) => {
    const fetchData = async (model) => {
        try {
            const data = await model.find();
            return JsonResponse.success(200, data).send(res);
        } catch (error) {
            console.log(error);
            return JsonResponse.fail(500, error).send(res);
        }
    }
    fetchData(model);
} 

const getPostDetails = (req, res, model) => {
    const fetchData = async (postId) => {
        try {
            const data = await model.findById(postId);
            return JsonResponse.success(200, data).send(res);
        } catch (error) {
            console.log(error);
            return JsonResponse.fail(500, error).send(res);
        }
    }
    fetchData(req.params.id);
}

const createSubmissions = (req, res, category) => {
    const postData = async () => {
        try {
            await submissions.create(parsedBody);
            return JsonResponse.success(200, "Submission successfully added!").send(res);
        } catch (error) {
            console.log(error);
            return JsonResponse.fail(400, error).send(res);
        }
    }
    const parsedBody = req.body;
    parsedBody.tag = category;
    postData(parsedBody);
}

module.exports= { getPosts, getPostDetails, createSubmissions }