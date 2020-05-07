module.exports = app => {
    const route = require("./../controllers/mlController");
    app.post("/ml", route.get);
    app.get("/ml", route.get_process);
};
