
const afterLoginFunction = () => {
  //Visit System and Login
  cy.visit('http://localhost:8000');
  cy.get('input[name="email"]').type("sophia.mason@gmail.com");
  cy.get('input[name="password"]').type("password");
  cy.get('.LoginButton').click();
    };
  
  describe("Resources Tests", () => {
    beforeEach(() => {
    afterLoginFunction();
    });
    it("can add a new rating", () => {
      //Click the See Resources Button
      cy.contains('See Resources').click();
      cy.wait(5000);
      //Click the Ratings Button
      cy.contains("Rate It").click();
      cy.wait(1000);
      //Give a Rating
      cy.get('input[name="ratingComment"]').type("Test Rating")
      cy.get('input[name="newRating"][value=4]').click({ force: true });
      cy.get('button[type = "submit"]').click();
      //Refresh the page
      cy.reload()
      //Assert that the Test Rating was Added
      cy.contains('Test Rating').should('exist')
  });
});



