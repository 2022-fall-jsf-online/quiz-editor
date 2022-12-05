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
    // x = quiz obj
    this.quizzes = quizzes.map(x => ({
      quizName: x.name
      , quizQuestions: x.questions.map((y: any) => ({
        questionName: y.name
      }))
    }));
    console.log(this.quizzes);
  }

  // Global Vars
  quizzes: QuizDisplay[] = [];
  selectedQuiz: QuizDisplay | undefined = undefined;

  selectQuiz = (q: QuizDisplay) => {
    this.selectedQuiz = q;
    console.log(this.selectedQuiz);
  }

  editedQuizName = "";
  

  addNewQuiz = () => {
    //need new quiz var/obj
    const newQuiz = {
      quizName: "Untitled Quiz"
      , quizQuestions: []
    }

    //update quizzes to array of current + newQuiz
    this.quizzes = [
      ...this.quizzes
      , newQuiz
    ]

    //update selectedQuiz to newQuiz
    this.selectedQuiz = newQuiz;
  }


  updateQuizName = () => {
    this.selectedQuiz.quizName = this.editedQuizName;
  };
  
}
