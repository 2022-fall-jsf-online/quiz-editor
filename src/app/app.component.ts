import { Component, OnInit } from '@angular/core';
import { generate } from 'rxjs';
import { QuizService, QuizFromWeb } from './quiz.service';

interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
  markedForDelete: boolean;
  newlyAddedQuiz: boolean;
  // checksum = a way to validate data that is sent across the web - normally numbers
  // can use to confirm if quiz has changed to find edited quiz
  naiveQuizChecksum: string;
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

  loading = true;
  errorLoadingQuizzes = false;
  editedQuiz = false;

  //take quizFromWeb (original) - use to compare to edited Quiz
  generateNaiveQuizChecksum = (quiz: QuizFromWeb) => {
    //creates a string of quiz name~questionName~questionName...
    return quiz.name + quiz.questions.map(x => '~' + x.name).join('')
  }

  loadQuizzesFromCloud = async () => {

    try {
      const quizzes = await this.quizSvc.loadQuizzes() ?? [];
      console.log(quizzes);

      //x = each quiz{}
      this.quizzes = quizzes.map(x => ({
        quizName: x.name
        , quizQuestions: x.questions.map(y => ({
          questionName: y.name
        }))
        , markedForDelete: false
        , newlyAddedQuiz: false
        , naiveQuizChecksum: this.generateNaiveQuizChecksum(x)
      }));      

      this.loading = false;
    }
    catch (err) {
      console.error(err);
      this.errorLoadingQuizzes = true;
      this.loading = false;      
    }
  };

  ngOnInit() {
    this.loadQuizzesFromCloud();
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
      , newlyAddedQuiz: true
      , naiveQuizChecksum: ""
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
      // this.deletedQuizCount++;
    }
  };


  jsPromisesOne = () => {
    const n = this.quizSvc.getMagicNumber(true);
    console.log(n); // ? ? ? 

    n.then(
      number => {
        console.log(number);

        const n2 = this.quizSvc.getMagicNumber(true);
        console.log(n2); // ? ? ?
        
        n2.then(x => console.log(x)).catch(e => console.error(e));
      }
    ).catch(
      err => {
        console.error(err);
      }
    )
  };

  jsPromisesTwo = async () => {

    try {
      const x = await this.quizSvc.getMagicNumber(true);
      console.log(x); // ? ? ?

      const y = await this.quizSvc.getMagicNumber(true);
      console.log(y); // ? ? ?
    }
    
    catch (err) {
      console.error(err);
    }
  };

  jsPromisesThree = async () => {

    try {
      const x = this.quizSvc.getMagicNumber(true);
      console.log(x); // ? ? ?

      const y = this.quizSvc.getMagicNumber(true);
      console.log(y); // ? ? ?

      const results = await Promise.all([x, y]);
      // const results = await Promise.race([x, y]);
      console.log(results); // ? ? ?
    }
    
    catch (err) {
      console.error(err);
    }
  };


  cancelAllChanges = () => {
    this.loadQuizzesFromCloud();
    this.selectedQuiz = undefined;
  }


  getDeletedQuizzes = () => {
    // all quizzes - filter x, where x == true
    // gives array of QuizDisplay[]
    return this.quizzes.filter(x => x.markedForDelete);
  }

  // ts getter/setter readOnly property
  get deletedQuizCount() {
    // runs this function (166) & get array length
    return this.getDeletedQuizzes().length;
  }

  getAddedQuizzes = () => {
    return this.quizzes.filter(x => x.newlyAddedQuiz && !x.markedForDelete)
  }

  get addedQuizCount() {
    return this.getAddedQuizzes().length;
  }

  getEditedQuizzes = () => {
    //x = QuizDisplay - array of current quizzes, including new, deleted, edited
    //compare to original x (quiz from web)
    return this.quizzes.filter(x => 
      x.quizName + x.quizQuestions.map(y => '~' + y.questionName).join('') !== x.naiveQuizChecksum
      && !x.newlyAddedQuiz
      && !x.markedForDelete
    );
  };

  get editedQuizCount() {
    return this.getEditedQuizzes().length;
  }
}
