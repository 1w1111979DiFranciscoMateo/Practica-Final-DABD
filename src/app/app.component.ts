import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'PracticaFinalDABD';
  
  ngOnInit(): void {
    console.log("email: 404931@homesafe.io");
    console.log("password: 404931_sAGRIPANTI!");
  }
  
}
