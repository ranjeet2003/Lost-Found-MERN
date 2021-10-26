import { React, Component } from "react";
import { Link } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import SignedSaaSProductLandingPage from "../demos/SignedSaaSProductLandingPage";
import { Container as ContainerBase } from "components/misc/Layouts";
import Header from "components/hero/CustomHeader.js";
import tw from "twin.macro";
import styled from "styled-components";
import illustration from "images/login-illustration.svg";
import logo from "images/logo-new.jpg";
import googleIconImageSrc from "images/google-icon.png";
import twitterIconImageSrc from "images/twitter-icon.png";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import ErrorModel from "../helpers/ErrorModal";
import Spinner from "../helpers/LoadingSpinner";

const Container = tw(
  ContainerBase
)`min-h-screen  text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

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
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-sm bg-contain bg-center bg-no-repeat`}
`;

export const DesktopNavLinks = tw.nav`
  hidden lg:flex flex-1 justify-between items-center
`;

// const LoginAlert = (
//   <>
//     <SweetAlert success title="Woot!" onConfirm={this.hideAlert}>
//       I did it!
//     </SweetAlert>
//   </>
// );

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
      isError: null,
      username: "",
      alert: null,
      isLoggedIn: false,
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    // const history = useHistory();
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

  onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // if (!this.state.email || !this.state.mobile) {
      //   this.setState({
      //     isError: "Please enter your E-mail and password",
      //   });
      // } else {
      this.setState({ isLoading: true });
      const response = await fetch("http://localhost:5555/api/users/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cache: "no-cache",
        },
        credentials: "include",
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log(responseData);
      this.setState({
        username: responseData.data.user.name,
      });
      console.log(responseData.data.user.name);
      // console.log(responseData.status);

      if (response && responseData.status === "success") {
        this.setState({
          isLoggedIn: true,
        });
        console.log("Logged In: " + this.state.isLoggedIn);
      }
      this.setState({ username: responseData.data.user.name });
      // }
      console.log(this.state.username);
    } catch (err) {
      console.log(err);
      this.setState({
        isError: err.message || "Something Went Wrong, Please Try Again Later",
      });
    }
    this.setState({ isLoading: false });
    console.log(window.location.pathname);
  };

  render(
    logoLinkUrl = "#",
    illustrationImageSrc = illustration,
    headingText = "Sign In To Lost-Found",
    socialButtons = [
      {
        iconImageSrc: googleIconImageSrc,
        text: "Sign In With Google",
        url: "https://google.com",
      },
      {
        iconImageSrc: twitterIconImageSrc,
        text: "Sign In With Twitter",
        url: "https://twitter.com",
      },
    ],
    submitButtonText = "Sign In",
    SubmitButtonIcon = LoginIcon,
    forgotPasswordUrl = "#"
  ) {
    return (
      <>
        <ErrorModel error={this.state.isError} onClear={this.errorHandler} />
        {this.state.isLoggedIn ? (
          <>
            {window.history.pushState("/", "Page 2", "/")}
            <SignedSaaSProductLandingPage isLoggedIn={this.state.isLoggedIn} />
          </>
        ) : (
          <AnimationRevealPage>
            <Header roundedHeaderButton={true} />

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
                          type="email"
                          placeholder="Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.onChangeHandler}
                        />
                        <Input
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={this.state.passoword}
                          onChange={this.onChangeHandler}
                        />
                        <SubmitButton type="submit">
                          <SubmitButtonIcon className="icon" />
                          <span className="text">{submitButtonText}</span>
                        </SubmitButton>
                      </Form>
                      <DividerTextContainer>
                        <DividerText>
                          Or Sign in with your social account
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
                        <a
                          href={forgotPasswordUrl}
                          tw="border-b border-gray-500 border-dotted"
                        >
                          Forgot Password ?
                        </a>
                      </p>
                      <p tw="mt-8 text-sm text-gray-600 text-center">
                        Don't have an account?{" "}
                        {/* <a
                    href={signInUrl}
                    tw="border-b border-gray-500 border-dotted"
                  > */}
                        <Link to="/signup">Sign Up</Link>
                        {/* </a> */}
                      </p>
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

export default Login;

// const collapseBreakPointCssMap = {
//   sm: {
//     mobileNavLinks: tw`sm:hidden`,
//     desktopNavLinks: tw`sm:flex`,
//     mobileNavLinksContainer: tw`sm:hidden`,
//   },
//   md: {
//     mobileNavLinks: tw`md:hidden`,
//     desktopNavLinks: tw`md:flex`,
//     mobileNavLinksContainer: tw`md:hidden`,
//   },
//   lg: {
//     mobileNavLinks: tw`lg:hidden`,
//     desktopNavLinks: tw`lg:flex`,
//     mobileNavLinksContainer: tw`lg:hidden`,
//   },
//   xl: {
//     mobileNavLinks: tw`lg:hidden`,
//     desktopNavLinks: tw`lg:flex`,
//     mobileNavLinksContainer: tw`lg:hidden`,
//   },
// };
