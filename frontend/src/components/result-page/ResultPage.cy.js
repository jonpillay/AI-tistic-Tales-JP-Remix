import { mount } from "@cypress/react";
import ResultPage from "./ResultPage";

describe("ResultPage", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.intercept("POST", "/images", { fixture: "images.json" }).as(
      "imagesRequest"
      // mock response from the server - message history
    );
    cy.intercept("POST", "/story", { fixture: "story.json" }).as(
      "storyRequest"
    );
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it("shows the result page when loaded", () => {
    mount(<ResultPage navigate={() => {}} />);

    cy.wait(["@imagesRequest", "@storyRequest"]).then(() => {
      cy.get(".result-page").should("be.visible");
      cy.get(".result-page").should("contain", "Here's your story!");
      cy.get(".results-page-container").should("be.visible");
      cy.get(".buttons").should("be.visible");
      cy.get(".buttons").should("contain", "Save this story");
      cy.get(".buttons").should("contain", "What happens next?");
      cy.get(".buttons").should("contain", "Steer this story");
      cy.get(".buttons").should("contain", "Refresh the story");
    });
  });

  it("redirects to '/' when the home button is clicked", () => {
    mount(<ResultPage navigate={() => {}} />);

    cy.wait(["@imagesRequest", "@storyRequest"]).then(() => {
      cy.get(".results-page-home").click();
      cy.url().should("eq", "http://localhost:3000/");
      cy.getAllLocalStorage('userChoices').should('be.null');
    });
  });
});
