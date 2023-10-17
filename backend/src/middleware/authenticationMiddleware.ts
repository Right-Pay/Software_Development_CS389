import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: 'http://localhost:3001/',
  issuerBaseURL: 'https://dev-6uux541sywon80js.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

export default checkJwt;