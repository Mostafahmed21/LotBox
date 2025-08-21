const successResponse = ({
    res = res,
    status = 200,
    message = 'success',
    data = {},
}) => {
    return res.status(status).json({ message, data });
};

export default successResponse;
