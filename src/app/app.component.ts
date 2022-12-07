import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
  markedForDelete: boolean;
}

interface QuestionDisplay {
  questionName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';

  constructor(
    public quizSvc: QuizService
  ) {
  }

  errorLoadingQuiz = false;

  ngOnInit() {
    const quizzes = this.quizSvc.loadQuizzes();
    console.log(quizzes);

    //Observables must be subscribed too
    // Data represents QuizFromWeb[]
    quizzes.subscribe({
      next: data => {
        console.log(data);
        this.quizzes = data.map(x => ({
          quizName: x.name
          , quizQuestions: x.questions.map(y => ({
            questionName: y.name
          }))
          , markedForDelete: false

        }));
      }
      , error: err => {
        console.error(err.error);
        this.errorLoadingQuiz = true;
      }

    });


  }

  quizzes: QuizDisplay[] = [];

  selectedQuiz: QuizDisplay | undefined = undefined;

  selectQuiz = (q: QuizDisplay) => {
    this.selectedQuiz = q;
    console.log(this.selectedQuiz);
  };

  addNewQuiz = () => {

    const newQuiz = {
      quizName: "Untitled Quiz"
      , quizQuestions: []
      , markedForDelete: false
    };

    this.quizzes = [
      ...this.quizzes
      , newQuiz
    ];

    this.selectQuiz(newQuiz);
  };

  addNewQuestion = () => {

    if (this.selectedQuiz) {
      this.selectedQuiz.quizQuestions = [
        ...this.selectedQuiz.quizQuestions
        , {
          questionName: "Untitled Question"
        }
      ];
    }
  };

  removeQuestion = (questionToRemove: QuestionDisplay) => {
    if (this.selectedQuiz) {
      this.selectedQuiz.quizQuestions = this.selectedQuiz.quizQuestions.filter(x => x !== questionToRemove);
    }
  };
}
