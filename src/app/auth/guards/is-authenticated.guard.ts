import { CanActivateFn } from '@angular/router';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  
  
  console.log('isAuthenticated');
  console.log({route, state});
  
  
  
  
  return true;
};
