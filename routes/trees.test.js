//Tests
import request from "supertest";
import app from "../app.js";


describe("Get requests to /trees:", () => {


    it("Should return an array of objects", async () => {
        await request(app)
            .get("/trees")
            .expect(200)
            .expect(function (res) {
                const actual = res.body;
                const expected = {
                    success: true,
                    message: `Retrieved all trees`,
                    payload: expect.arrayContaining([expect.any(Object)])
                }

                expect(actual).toStrictEqual(expected);
            });

    });

})

describe("Get requests to /trees:id:", () => {


    it("Should return an array with a single object matching ID 25 when given 25 as ID", async () => {
        await request(app)
            .get("/trees/25")
            .expect(200)
            .expect(function (res) {
                const actual = res.body;
                const expected = {
                    success: true,
                    message: `Retrieved tree with id 25`,
                    payload: expect.arrayContaining([expect.objectContaining({
                        "id": 25
                    })])
                }

                expect(actual).toStrictEqual(expected);
            });

    });

})

describe("Post requests to /trees:", () => {


    it("Should return an array containing a single object when creating a new tree", async () => {

        const tree = {
            datePlanted: "2021-12-24",
            dateWatered: "2021-12-24",
            ownerTitle: "Mr",
            ownerFirstName: "Laur",
            ownerLastName: "Nunn",
            seed: "Oak",
            colour: "2e8b57",
            label: "My first tree!",
            password: "test"
        }

        await request(app)
            .post("/trees")
            .send(tree)
            .expect(200)
            .expect(function (res) {
                const actual = res.body;
                const expected = {
                    success: true,
                    message: "Successfully created new tree..",
                    payload: expect.arrayContaining([expect.objectContaining({
                        "seed": "Oak"
                    })])
                }
                expect(actual).toStrictEqual(expected);
            });

    });

})

describe("Delete requests to /trees:id", () => {


    it("Should return an array containing a single object when deleting a tree with specified ids", async () => {

        const id = 31

        await request(app)
            .delete(`/trees/${id}`)
            .expect(200)
            .expect(function (res) {
                const actual = res.body;
                const expected = {
                    success: true,
                    message: `Deleted tree at id ${id}`,
                    payload: expect.arrayContaining([expect.objectContaining({
                        "id": id
                    })])
                }
                expect(actual).toStrictEqual(expected);
            });

    });

})