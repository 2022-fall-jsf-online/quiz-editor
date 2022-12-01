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

  errorLoadingQuizzes = false;

  ngOnInit() {
    const quizzes = this.quizSvc.loadQuizzes();
    console.log(quizzes);

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
        console.log(err.error);
        this.errorLoadingQuizzes = true;
      }
  });

    // this.quizzes = quizzes.map(x => ({
    //   quizName: x.name
    //   , quizQuestions: x.questions.map((y: any) => ({
    //     questionName: y.name
    //   }))
    //   , markedForDelete: false
    // }));

    console.log(this.quizzes);
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

  jsPromisesOne = () => {
    const n = this.quizSvc.getMagicNumber(true);
    console.log(n); // ???
    
    n.then(
      number => {
        console.log(number);

        const n2 = this.quizSvc.getMagicNumber(true);
        console.log(n2);

        n2.then(x => console.log(x)).catch(e => console.error(e));
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  };

  jsPromisesTwo = async () => {

    try{
    const x = await this.quizSvc.getMagicNumber(true);
    console.log(x);

    const y = await this.quizSvc.getMagicNumber(true);
    console.log(y);
    }

    catch (err) {
      console.log(err);
    }
  };

  jsPromisesThree = async () => {

    try{
    const x = this.quizSvc.getMagicNumber(true);
    console.log(x);

    const y = this.quizSvc.getMagicNumber(true);
    console.log(y);

    const results = await Promise.all([x, y]);
    console.log(results);
    }

    catch (err) {
      console.log(err);
    }
  };
  
}
