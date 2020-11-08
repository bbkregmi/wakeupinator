import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wakeupinator';
  formControl: FormControl = new FormControl('');
  wakeUpTime: any;

  coefficients = {
    INTERCEPT: 749.1144, // no value
    MONTH: 15.6278, // values are 1 - 12
    DAY_NUMBER: -0.5863, // values are 1 - 365
    DAY: 11.8238, // Value will be 1 for saturday, or 2 for sunday
  };

  isNightModeEnabled = false;

  ngOnInit() {
    // Get user's current time - if it's past 6 pm but before 6 am, enable night mode
    const userCurrentTime = new Date().getHours();
    if (userCurrentTime > 18 || userCurrentTime < 6) {
      this.isNightModeEnabled = true;
    }
  }

  weekendsOnlyFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Only allow Saturday and Sunday to be selected.
    return day === 0 || day === 6;
  }

  onDateChange() {
    const date: Date = this.formControl.value;
    const monthValue = date.getMonth() + 1;
    const dayNumberValue = this.getDayNumber(date);
    const dayValue = this.getDayValue(date);

    const timeInMinutes = this.coefficients.INTERCEPT + 
      (this.coefficients.MONTH * monthValue) + 
      (this.coefficients.DAY_NUMBER * dayNumberValue) + 
      (this.coefficients.DAY * dayValue);

    const timeInHours = timeInMinutes / 60;
    const minutes = Math.round((timeInHours % 1) * 60);
    const hours = Math.floor(timeInHours);

    this.wakeUpTime = `${hours}:${minutes < 10 ? `0` + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'} on ${date.toDateString()}`;

  }

  getDayNumber(enteredDate: Date): number {
    const enteredYear = enteredDate.getFullYear();
    const startOfYear = new Date('01/01/' + enteredYear);
    const dayDif = ((enteredDate.getTime() - startOfYear.getTime())  / 1000 / 60 / 60 / 24) + 1;
    return dayDif;
  }

  getDayValue(enteredDate: Date): number {
    // Sunday
    if (enteredDate.getDay() === 0) {
      return 2
    } else if (enteredDate.getDay() === 6) {
      //Saturday
      return 1;
    } else {
      return -1;
    }

  }
}
