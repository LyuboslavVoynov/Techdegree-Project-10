
const  express = require("express")
const  router = express.Router()
const  Books = require("../models").Books
const  Loans = require("../models").Loans
const  Patrons = require("../models").Patrons
const  Sequelize = require('sequelize')
const  Op = Sequelize.Op;
const  moment = require('moment');//'moment' for managing dates and times

let date = moment().format('YYYY-MM-DD')// today date in the right format created with 'moment'
let datePlus = moment(Date.now() + 7 * 24 * 3600 * 1000).format('YYYY-MM-DD');// 7 days later in the right format

router.get('/', (req, res, next)=>{
   res.render('pages/home', {title: 'Home'});
});

//GET ALL BOOKS,LOANS,PATRONS
router.get('/allbooks', (req, res, next)=>{
  Books.findAll().then((books)=>{
    res.render('pages/allbooks', {title: 'All Books', books: books});
  });
});

router.get('/allloans', (req, res, next)=>{
  Loans.findAll().then((loans)=>{
    Books.findAll().then((books)=>{
      Patrons.findAll().then((patrons)=>{
        res.render('pages/allloans', {title: 'All Loans', loans: loans, books: books, patrons: patrons});
      });
    });
  });
});
router.get('/allpatrons', (req, res, next)=>{
  Patrons.findAll().then((patrons)=>{
    res.render('pages/allpatrons', {title: 'All Patrons', patrons: patrons});
  });
});
//GET OVERDUE BOOKS,LOANS
router.get('/overdueBooks', (req, res, next)=>{
  Books.findAll().then((books)=>{
    Loans.findAll({
      where: {
        returned_on: null,
        return_by: {
          [Op.lt]: new Date()
        }
      }
    }).then((loans)=>{
      res.render('pages/overdueBooks', {title: 'Overdue Books', books: books, loans: loans});
    });
  });
});

router.get('/overdueLoans', (req, res, next)=>{
  Books.findAll().then((books)=>{
    Patrons.findAll().then((patrons)=>{
      Loans.findAll({
        where: {
          returned_on: null,
          return_by: {
            [Op.lt]: new Date()
          }
        }
      }).then((loans)=>{
        res.render('pages/overdueLoans', {title: 'Overdue Loans', books: books, loans: loans, patrons: patrons});
      });
    });
  });
});
//GET CHECKED OUT BOOKS,LOANS
router.get('/checkedBooks', (req, res, next)=>{
  Books.findAll().then((books)=>{
    Loans.findAll({
      where: {
        returned_on: null
      }
    }).then((loans)=>{
      res.render('pages/checkedBooks', {title: 'Checked Out Books', books: books, loans: loans});
    });
  });
});

router.get('/checkedLoans', (req, res, next)=>{
  Books.findAll().then((books)=>{
    Patrons.findAll().then((patrons)=>{
      Loans.findAll({
        where: {
          returned_on: null
        }
      }).then((loans)=>{
        res.render('pages/checkedLoans', {title: 'Checked Out Loans', books: books, loans: loans, patrons: patrons});
      });
    });
  });
});
//GET AND POST REQUESTS FOR BOOKS, LOANS, PATRONS
router.get('/newBook', (req, res, next)=>{
  res.render('pages/newBook', {title: 'New Book', book: Books.build()});
});

router.get('/newLoan', (req, res, next)=>{
  Books.findAll().then((books)=>{
    Patrons.findAll().then((patrons)=> {
      res.render('pages/newLoan', {title: 'New Loan', loan: Loans.build(), books: books, patrons: patrons, loaned_on:date, return_by:datePlus});
    });
  });
});

router.get('/newpatron', (req, res, next)=>{
  res.render('pages/newPatron', {title: 'New Patron', patron: Patrons.build()});
});

router.post('/newbook', (req, res, next) => {
  Books.create(req.body).then((book)=>{
    res.redirect('/allbooks');
  }).catch((error) => {
    if (error.name === "SequelizeValidationError") {
      res.render('pages/newBook', {title: 'New Book',errors: error.errors });
    } else {
       throw error;
     }
  });
});

router.post('/newloan', (req, res, next) => {
  Loans.create(req.body).then((loan)=>{
    res.redirect('/allloans');
  });
});

router.post('/newpatron', (req, res, next) => {
  Patrons.create(req.body).then((patron)=>{
    res.redirect('/allpatrons');
  }).catch((error) => {
    if (error.name === "SequelizeValidationError") {
      res.render('pages/newPatron', {title: 'New Patron', errors: error.errors });
    } else {
      throw error;
    }
  });
});

//GET AND POST UPDATING BOOKS
router.get('/:id/book', (req, res, next)=>{
  Books.findById(req.params.id).then((book)=>{
    Loans.findAll({
      where: {
        book_id: book.id
      }
    }).then((loans)=>{
      Patrons.findAll().then((patrons)=>{
        res.render('pages/bookDetail', {title: 'Book Detail Page', book: book, loans: loans, patrons: patrons});
      });
    });
  });
});


router.post('/:id/updateBook', (req, res, next) => {
  Books.findById(req.params.id).then((book)=>{
    return book.update(req.body).then((book)=>{
      res.redirect('/allbooks');
    }).catch((error) => {
      if (error.name === "SequelizeValidationError") {
        res.render('pages/bookForm', { book:book, errors: error.errors });
      } else {
        throw error;
      }
    });
  });
});

//GET AND POST UPDATING PATRON
router.get('/:id/patron', (req, res, next)=>{
  Patrons.findById(req.params.id).then((patron)=>{
    Loans.findAll({
      where: {
        patron_id: patron.id
      }
    }).then((loans)=>{
      Books.findAll().then((books)=>{
        res.render('pages/patronDetail', {title: 'Patron Detail Page', patron: patron, loans: loans, books: books});
      });
    });
  });
});

router.post('/:id/updatePatron', (req, res, next) => {
  Patrons.findById(req.params.id).then((patron)=>{
    return patron.update(req.body).then((patron)=>{
      res.redirect('/allpatrons');
    }).catch((error) => {
      if (error.name === "SequelizeValidationError") {
        res.render('pages/patronForm', { patron:patron, errors: error.errors, });
      } else {
        throw error;
      }
    });
  });
});

//GET AND POST RETURN BOOKS USING ID
router.get('/:id/return', (req, res, next)=>{
  Books.findById(req.params.id).then((book)=>{
    Loans.findAll({
      where: {
        book_id: book.id,
        returned_on: null
      }
    }).then((loans)=>{
      Patrons.findAll({
        where: {
          id: loans[0].patron_id
        }
      }).then((patrons)=>{
        res.render('pages/returnbook', {title: 'Return Book', book: book, loans: loans, patrons: patrons, date:date });
      });
    });
  });
});


router.post('/:id/return', (req, res, next) => {
  Loans.findById(req.params.id).then((loan)=>{
    return loan.update(req.body).then((loan)=>{
      res.redirect('/allloans');
    });
  });
});
module.exports = router;
