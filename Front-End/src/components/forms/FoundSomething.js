import React, { Component } from "react";
import tw from "twin.macro";
import styled from "styled-components";
// import FileBase from "react-file-base64";
// import { css } from "styled-components/macro"; //eslint-disable-line
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import EmailIllustrationSrc from "images/email-illustration.svg";
import SignedHeader from "../headers/SignedHeader";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import ErrorModel from "../../helpers/ErrorModal";
import Spinner from "../../helpers/LoadingSpinner";
const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-12 lg:mr-16 md:order-first`
    : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`;
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`;
// const Textarea = styled(Input).attrs({ as: "textarea" })`
//   ${tw`h-24`}
// `;

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`;

export default class FoundSomething extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docName: "",
      docSerial: "",
      docDescription: "",
      docImage: "",
      isLoading: false,
      isError: null,
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onChangeHandlerFile = this.onChangeHandlerFile.bind(this);
  }

  onChangeHandler(event) {
    let target = event.target;
    let value = target.value;
    let name = target.name;
    this.setState({
      [name]: value,
    });
  }

  onChangeHandlerFile(event) {
    this.setState({
      docImage: event.target.files[0],
    });
  }

  errorHandler = () => {
    this.setState({ isError: null });
  };

  checkImage = () => {
    if (!this.state.docImage) {
      return false;
    }
    return true;
  };

  onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      this.setState({ isLoading: true });
      console.log("isloading: " + this.state.isLoading);

      var formdata = new FormData();
      formdata.append("name", this.state.docName);
      formdata.append("description", this.state.docDescription);
      formdata.append("serial", this.state.docSerial);
      formdata.append("img", this.state.docImage);

      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
        credentials: "include",
      };

      if (!this.checkImage()) {
        this.setState({
          isError: "Please select an image of your document",
        });
      } else {
        const response = await fetch(
          "http://localhost:5555/api/docs/foundDocs",
          requestOptions
        );
        const responseData = await response.json();
        console.log("isloading: " + this.state.isLoading);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log(responseData);
      }
    } catch (err) {
      console.log(err);
      this.setState({
        isError: err.message || "Something Went Wrong, Please Try Again Later",
      });
    }
    this.setState({ isLoading: false });
  };

  fileHandler(file) {
    this.setState({
      ...this.state,
      docImage: file.base64,
    });
  }

  render(
    subheading = "Found Some Docs",
    heading = (
      <>
        Feel free to upload the details of{" "}
        <span tw="text-primary-500">Found docs</span>
        <wbr /> .
      </>
    ),
    description = "Please upload the details of document that you've found and make sure all details are correct and image is clear because we will use these details to match your docs.",
    submitButtonText = "Upload Data",
    textOnLeft = true
  ) {
    return (
      <>
        <ErrorModel error={this.state.isError} onClear={this.errorHandler} />
        <AnimationRevealPage>
          {/* <Header roundedHeaderButton={true} /> */}
          <SignedHeader />
          <Container>
            {this.state.isLoading && <Spinner asOverlay />}
            <TwoColumn>
              <ImageColumn>
                <Image imageSrc={EmailIllustrationSrc} />
              </ImageColumn>
              <TextColumn textOnLeft={textOnLeft}>
                <TextContent>
                  {subheading && <Subheading>{subheading}</Subheading>}
                  <Heading>{heading}</Heading>
                  {description && <Description>{description}</Description>}
                  <Form
                    onSubmit={this.onSubmitHandler}
                    encType="multipart/form-data"
                  >
                    <Input
                      type="text"
                      name="docName"
                      placeholder="Document Name e.g marksheet."
                      value={this.state.docName}
                      onChange={this.onChangeHandler}
                    />
                    <Input
                      type="text"
                      name="docSerial"
                      placeholder="Enter any serial number or unique number."
                      value={this.state.docSerial}
                      onChange={this.onChangeHandler}
                    />
                    <Input
                      type="text"
                      name="docDescription"
                      placeholder="Describe something about that doc."
                      value={this.state.docDescription}
                      onChange={this.onChangeHandler}
                    />
                    <br />
                    {/* <FileBase onDone={(file) => this.fileHandler(file)} /> */}
                    <Input
                      type="file"
                      id="fileItem"
                      name="file"
                      // required="required"
                      placeholder="Upload file here."
                      // value={this.state.docDescription}
                      onChange={this.onChangeHandlerFile}
                    />
                    <SubmitButton type="submit">
                      {!this.state.isLoading
                        ? submitButtonText
                        : "Uploading data..."}
                    </SubmitButton>
                  </Form>
                </TextContent>
              </TextColumn>
            </TwoColumn>
          </Container>
        </AnimationRevealPage>
      </>
    );
  }
}
