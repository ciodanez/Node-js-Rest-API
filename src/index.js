import app from "./app";

const main = () => {
    app.listen(app.get("port"));
    console,console.log(`Server on port ${app.get("port")}`);
};

main();