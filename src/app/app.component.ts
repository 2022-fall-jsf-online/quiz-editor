import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

//define shape of 
interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
}

interface QuestionDisplay {
  questionName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
//to use OnInit, must have function of ngOnInit
export class AppComponent implements OnInit {
  title = 'quiz-editor';

  //constructor params is where we do our dependecy injection
  //we are passing in new instance of QuizService & naming quizSvc
  constructor(
    public quizSvc: QuizService
  ) {
  
  };

  //Running loadQuizzes from Instance and assign to var quizzes
  ngOnInit() {
    const quizzes = this.quizSvc.loadQuizzes();
    console.log(quizzes);

    //x is already qualified but y is not
    //we have to qualify y as any type object and put in () for this
    this.quizzes = quizzes.map(x => ({
      quizName: x.name
      , quizQuestions: x.questions.map((y: any) => ({
        questionName: y.name
      }))
    }));
    console.log(this.quizzes);
  }

  quizzes: QuizDisplay[] = [];

  selectedQuiz: QuizDisplay | undefined = undefined;

  selectQuiz = (q: QuizDisplay) => {
    this.selectedQuiz = q;
    console.log(this.selectedQuiz);
  }

  editedQuizName = "";
  updateQuizName = () => {

  };

  addNewQuiz = () => {

  };
  
}
