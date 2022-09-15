import React, { useEffect, useState } from "react";
import Joi from "joi-browser";
import Moment from "moment";
import "./Tweet.css";
import axios from "axios";
import { toast } from "react-toastify";

const Tweet = () => {
  const [values, setValues] = useState({
    tweet_text: "",
    user: "",
  });
  const [tweets, setTweets] = useState([]);
  const [isRefresh, SetIsRefresh] = useState(false);

  const [characterCount, setCharacterCount] = useState(0);
  const [errors, setErrors] = useState({
    tweet_text: "",
    user: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/tweets")
      .then((res) => {
        setTweets(res.data);
      })
      .catch((err) => {});
  }, [isRefresh]);
  const handleInputOnChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  var schema = {
    tweet_text: Joi.string().required().label("tweet_text"),
    user: Joi.string().required().label("user"),
  };

  const formValidation = () => {
    const result = Joi.validate(values, schema, { abortEarly: false });
    if (!result.error) return null;

    let errors = {};
    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const eerrors = formValidation();

    if (eerrors) {
      setErrors({ ...eerrors });

      console.log(eerrors);
    } else {
      setErrors({});

      addTweet({
        ...values,
      });
    }
  };

  const resetForm = () => {
    setValues({
      tweet_text: "",
      user: "",
    });
    setErrors({
      tweet_text: "",
      user: "",
    });
  };
  const addTweet = () => {
    axios
      .post("http://localhost:4000/api/tweet", values)
      .then((response) => {
        resetForm();
        toast("Tweet post successfully");
        SetIsRefresh(!isRefresh);
      })
      .catch((err) => {
        alert("Internal server error");
      });
  };
  return (
    <>
      <div className="container px-4 py-5 mx-auto">
        <div className="card card0">
          <div className="d-flex flex-lg-row flex-column-reverse">
            <div className="card card1">
              <div className="row justify-content-center my-auto">
                <div className="col-md-8 col-10 my-5">
                  <h3 className="mb-5 text-center heading">Create Tweet</h3>
                  <form onSubmit={handleOnSubmit}>
                    <div className="form-group mb-2">
                      <label className="form-control-label text-muted mb-1">
                        Tweet Something
                      </label>
                      <textarea
                        className="form-control"
                        type="text"
                        id="tweet_text"
                        name="tweet_text"
                        min="1"
                        maxLength={240}
                        placeholder="Tweet here..."
                        onChange={handleInputOnChange}
                        onInput={(e) =>
                          setCharacterCount(e.target.value.length)
                        }
                        value={values.tweet_text}
                      />
                      {characterCount ? (
                        <>
                          <div className="row justify-content-end text-danger">
                            {characterCount} / 240
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      {errors.tweet_text && (
                        <div className=" text-danger">
                          Please enter What woould you like to tweet!
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-control-label text-muted mb-1">
                        User
                      </label>
                      <select
                        className="form-control"
                        type="select"
                        id="user"
                        name="user"
                        value={values.user}
                        onChange={handleInputOnChange}
                      >
                        <option>Select User...</option>
                        <option>MAX</option>
                        <option>Dave</option>
                        <option>Neal</option>
                      </select>
                      {errors.user && (
                        <div className=" text-danger">Please Select User</div>
                      )}
                    </div>
                    <div className="row justify-content-center">
                      <button type="submit" className="btn-block btn-color">
                        Tweet
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="card card2">
              <div className="row justify-content-center my-auto">
                <div className="col-md-10 col-10">
                  <h3 className="text-center heading">Tweets</h3>
                  <table className="table">
                    <thead>
                      <tr className="bg-table">
                        <th scope="col">User</th>
                        <th scope="col">Tweet Content</th>
                        <th scope="col">Time</th>
                      </tr>
                    </thead>
                    {tweets.map((tweetsData, index) => {
                      return (
                        <tbody key={index}>
                          <tr>
                            <td>{tweetsData.user}</td>
                            <td>{tweetsData.tweet_text}</td>
                            <td>
                              {Moment(tweetsData.creation_date).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tweet;
