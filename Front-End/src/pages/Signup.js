import { React, Component } from "react";
import { Link } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import SignedSaaSProductLandingPage from "../demos/SignedSaaSProductLandingPage";

import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import illustration from "images/signup-illustration.svg";
import logo from "images/logo-new.jpg";
import ErrorModel from "../helpers/ErrorModal";
import Spinner from "../helpers/LoadingSpinner";
import googleIconImageSrc from "images/google-icon.png";
import twitterIconImageSrc from "images/twitter-icon.png";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import { ReactComponent as PhoneIncoming } from "feather-icons/dist/icons/phone-incoming.svg";
import { ReactComponent as VerifyIcon } from "feather-icons/dist/icons/check-circle.svg";
import Header from "components/hero/CustomHeader.js";

const Container = tw(
  ContainerBase
)`min-h-screen text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const OtpContainer = tw.div` flex flex-row mt-5 gap-2`;
// const OtpInputContainer = tw.div`col-span-2`;

const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full  px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const OtpButton = styled.button`
  ${tw` tracking-tighter font-semibold bg-green-500 text-gray-100 w-full  py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;
export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      mobileNo: "",
      email: "",
      password: "",
      isLoading: false,
      isError: null,
      isSignedUp: false,
      otp: "",
      otpValidate: false,
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onChangeHandler(event) {
    let target = event.target;
    let value = target.value;
    let name = target.name;
    this.setState({
      [name]: value,
    });
  }
  errorHandler = () => {
    this.setState({ isError: null });
  };

  sendOtpHandler = async (event) => {
    event.preventDefault();
    try {
      if (!this.state.mobileNo) {
        this.setState({
          isError: "Please provide 10-Digit valid mobile number",
        });
      } else {
        this.setState({ isLoading: true });
        const response = await fetch(
          "http://localhost:5555/api/users/sendOTP",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              mobile: "+91" + this.state.mobileNo,
            }),
          }
        );
        // console.log(mobile);
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log(responseData.status);
        if (responseData.status) {
          this.setState({
            isLoading: false,
          });
          console.log("OTP sent on +91" + this.state.mobileNo);
        }
      }
    } catch (err) {
      console.log(err);
      this.setState({
        isError: err.message || "Something Went Wrong, Please Try Again Later",
      });
    }
  };

  validateOtpHandler = async (event) => {
    event.preventDefault();
    try {
      if (!this.state.otp) {
        this.setState({
          isError: "Please enter 4-Digit OTP recieved on your mobile number",
        });
      } else {
        this.setState({ isLoading: true });
        const response = await fetch(
          "http://localhost:5555/api/users/validateOTP",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              mobile: "+91" + this.state.mobileNo,
              otp: this.state.otp,
            }),
          }
        );
        // console.log(mobile);
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log(responseData.status);
        if (responseData.status) {
          this.setState({
            isLoading: false,
            otpValidate: true,
          });
          console.log("OTP verified on +91" + this.state.mobileNo);
        }
      }
    } catch (err) {
      console.log(err);
      this.setState({
        isError: err.message || "Something Went Wrong, Please Try Again Later",
      });
    }
  };

  onSubmitHandler = async (event) => {
    event.preventDefault();
    // window.alert("The form data is " + JSON.stringify(this.state));
    // console.log(email);
    try {
      if (!this.state.otpValidate) {
        this.setState({
          isError: "Please verify your OTP first",
        });
      } else {
        this.setState({ isLoading: true });
        // this.setState({isError: null})
        const response = await fetch("http://localhost:5555/api/users/signup", {
          method: "POST",
          // credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Cache: "no-cache",
          },
          credentials: "include",

          body: JSON.stringify({
            name: this.state.name,
            email: this.state.email,
            mobile: this.state.mobileNo,
            password: this.state.password,
          }),
        });
        // var myHeaders = new Headers();
        const responseData = await response.json();
        console.log(response);
        console.log(responseData);
        // const jwt = responseData.token;
        // myHeaders.append("Cookie", `jwt=${jwt}`);
        // console.log("Token is: " + jwt);
        if (!response.ok) {
          console.log(responseData.message);
          throw new Error(responseData.message);
        }
        console.log(responseData);
        console.log(response.headers);
        if (response && responseData.status === "success") {
          this.setState({
            isSignedUp: true,
          });
          console.log("signed up " + this.state.isSignedUp);
        }
      }
    } catch (err) {
      console.log(err);
      this.setState({
        isError: err.message || "Something Went Wrong, Please Try Again Later",
      });
    }
    this.setState({ isLoading: false });
    // const mob = responseData.mobile;
  };

  render(
    logoLinkUrl = "#",
    illustrationImageSrc = illustration,
    headingText = "Create Account For Lost-Found",
    socialButtons = [
      {
        iconImageSrc: googleIconImageSrc,
        text: "Sign Up With Google",
        url: "https://google.com",
      },
      {
        iconImageSrc: twitterIconImageSrc,
        text: "Sign Up With Twitter",
        url: "https://twitter.com",
      },
    ],
    submitButtonText = "Sign Up",
    SubmitButtonIcon = SignUpIcon,
    OTPButtonText = "Get OTP",
    OTPButtonIcon = PhoneIncoming,
    VerifyButtonIcon = VerifyIcon,
    tosUrl = "#",
    privacyPolicyUrl = "#"
  ) {
    return (
      <>
        <ErrorModel error={this.state.isError} onClear={this.errorHandler} />
        {this.state.isSignedUp ? (
          <>
            {window.history.pushState("/", "Page 2", "/")}
            <SignedSaaSProductLandingPage />
          </>
        ) : (
          <AnimationRevealPage>
            {/* <Navbar roundedHeaderButton={true} /> */}
            <Header roundedHeaderButton={true} />
            {/* <DummyImag   /> */}

            <Container>
              {this.state.isLoading && <Spinner asOverlay />}
              <Content>
                <MainContainer>
                  <LogoLink href={logoLinkUrl}>
                    <LogoImage src={logo} />
                  </LogoLink>
                  <MainContent>
                    <Heading>{headingText}</Heading>
                    <FormContainer>
                      <Form onSubmit={this.onSubmitHandler}>
                        <Input
                          type="text"
                          placeholder="Name"
                          name="name"
                          value={this.state.name}
                          onChange={this.onChangeHandler}
                        />
                        <Input
                          type="email"
                          placeholder="Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.onChangeHandler}
                        />
                        <OtpContainer>
                          {/* <OtpInputContainer> */}
                          <Input
                            type="text"
                            placeholder="Mobile Number"
                            name="mobileNo"
                            value={this.state.mobileNo}
                            onChange={this.onChangeHandler}
                          />
                          <OtpButton
                            type="button"
                            onClick={this.sendOtpHandler}
                          >
                            <OTPButtonIcon className="icon" />
                            <span className="text">{OTPButtonText}</span>
                          </OtpButton>
                          {/* </OtpInputContainer> */}
                        </OtpContainer>
                        <OtpContainer>
                          <Input
                            type="text"
                            placeholder="Enter OTP"
                            name="otp"
                            value={this.state.otp}
                            onChange={this.onChangeHandler}
                          />
                          <OtpButton
                            type="button"
                            onClick={this.validateOtpHandler}
                          >
                            <VerifyButtonIcon className="icon" />
                            {/* <span className="text">Verify OTP</span> */}
                            {this.state.otpValidate ? (
                              <span className="text">Verified</span>
                            ) : (
                              <span className="text">Verify OTP</span>
                            )}
                          </OtpButton>
                        </OtpContainer>
                        <Input
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={this.state.password}
                          onChange={this.onChangeHandler}
                        />
                        <SubmitButton type="submit">
                          <SubmitButtonIcon className="icon" />
                          <span className="text">{submitButtonText}</span>
                        </SubmitButton>
                        <DividerTextContainer>
                          <DividerText>
                            Or Sign up with your social account
                          </DividerText>
                        </DividerTextContainer>
                        <SocialButtonsContainer>
                          {socialButtons.map((socialButton, index) => (
                            <SocialButton key={index} href={socialButton.url}>
                              <span className="iconContainer">
                                <img
                                  src={socialButton.iconImageSrc}
                                  className="icon"
                                  alt=""
                                />
                              </span>
                              <span className="text">{socialButton.text}</span>
                            </SocialButton>
                          ))}
                        </SocialButtonsContainer>
                        <p tw="mt-6 text-xs text-gray-600 text-center">
                          I agree to abide by Lost-Found{" "}
                          <a
                            href={tosUrl}
                            tw="border-b border-gray-500 border-dotted"
                          >
                            Terms of Service
                          </a>{" "}
                          and its{" "}
                          <a
                            href={privacyPolicyUrl}
                            tw="border-b border-gray-500 border-dotted"
                          >
                            Privacy Policy
                          </a>
                        </p>

                        <p tw="mt-8 text-sm text-gray-600 text-center">
                          Already have an account?{" "}
                          {/* <a
                    href={signInUrl}
                    tw="border-b border-gray-500 border-dotted"
                  > */}
                          <Link to="/login">Sign In</Link>
                          {/* </a> */}
                        </p>
                      </Form>
                    </FormContainer>
                  </MainContent>
                </MainContainer>
                <IllustrationContainer>
                  <IllustrationImage imageSrc={illustrationImageSrc} />
                </IllustrationContainer>
              </Content>
            </Container>
          </AnimationRevealPage>
        )}
      </>
    );
  }
}
// export default ({
//   // roundedHeaderButton = "",

//   // signInUrl = "#",
// }) => (

// );
