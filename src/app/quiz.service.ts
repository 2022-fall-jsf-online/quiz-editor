import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor() { }

  //don't need to call this function a const because we are within a class
  //it is a loadQuizzes property of the quiz.service class
  loadQuizzes = () => {
    //can't have implicit any so need to qualify this w/ : any[]
    const quizzesFromWeb: any[] = [
      {
        name: 'Quiz 1'
        , questions: [
          {
            name: 'Question 1'
          }
          , {
            name: 'Question 2'
          }
        ]
      }
      , {
        name: 'Quiz 2'
        , questions: [
          {
            name: 'Question 1'
          }
          , {
            name: 'Question 2'
          }
        ]
      }
    ];
    return quizzesFromWeb;
  };
}
