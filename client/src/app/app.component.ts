import { Component, OnInit } from '@angular/core';
import { PassengerService } from './services/passenger.service';
import { Passenger } from './models/passenger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [PassengerService]
})
export class AppComponent implements OnInit {
  title = 'FlyghtBooking';
  public passenger: Passenger;
  public identity;
  public token;
  public errorMessage;

  constructor(
    private _passengerService: PassengerService
  ) {
    this.passenger = new Passenger('', '', 'ROLE_CLIENT');
  }

  ngOnInit() {
    this.identity = this._passengerService.getIdentity();
    this.token = this._passengerService.getToken();
  }

  public onSubmit() {
    console.log(this.passenger);

    this._passengerService.signup(this.passenger).subscribe(
      response => {
        let identity =  response.passenger;
        this.identity = identity;

        if(!this.identity._id) {
          alert('El pasajero no está correctamente identificado');
        }else {
          localStorage.setItem('identity', JSON.stringify(identity));
          // Conseguir el token
          this._passengerService.signup(this.passenger, 'true').subscribe(
            response => {
              let token =  response.token;
              this.token = token;

              if(this.token.length <= 0) {
                alert('El token no se ha generado');
              }else {
                localStorage.setItem('token', token);
                console.log(token);
                console.log(identity);

              }
            },
            error => {
              var errorMessage = <any>error;

              if(errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }
}
