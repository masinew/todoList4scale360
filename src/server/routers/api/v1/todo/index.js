import { Router } from 'express';
import Todo from '../../../../models/Todo';

const router = new Router();
const success = {
    success: true
};

const error = {
    success: false
};

router.get('/', (req, res) => {
    Todo.find({}, (err, result) => {
        if (err || !result) {
            res.json(Object.assign({}, error, {
                message: 'data is not found'
            }));
            return;
        }

        const newResult = result.map((r) => {
            return Object.assign({}, {
                ref: r.ref,
                todo: r.todo,
                isDone: r.isDone
            });
        });

        res.json(Object.assign({}, success, {
            todoList: newResult
        }));
    });
});

router.get('/:ref', (req, res) => {
    const todoId = req.params.ref;
    Todo.findOne({ref: todoId}, (err, result) => {
        if (err || !result) {
            res.json(Object.assign({}, error, {
                message: 'data is not found with your id'
            }));
            return;
        }

        const newResult = Object.assign({}, {
            ref: result.ref,
            todo: result.todo,
            isDone: result.isDone
        });

        res.json(Object.assign({}, success, {
            todoList: newResult
        }));
    });
});

router.post('/', (req, res) => {
    const todoVal = req.body.todo;
    const isDone = req.body.isDone.trim();
    if (!todoVal || !isDone) {
        res.json(Object.assign({}, error, {
            message: 'todo or isDone are empty.'
        }));
        return;
    }

    if (!isValidValues(req, res)) return;

    const query = Todo.findOne({}).sort({ref: -1});
    query.exec((err, result) => {
        if (err) {
            res.json(Object.assign({}, error, {
                message: 'occur some error when saving'
            }));
            return;
        }

        const nextRef = result === null ? 1 : result.ref+1;
        const todo = new Todo({
            ref: nextRef,
            todo: todoVal,
            isDone: isDone
        });

        todo.save((err, result) => {
            if (err) {
                res.json(error);
                return;
            }

            res.json(success);
        });
    });
});

router.put('/:ref', (req, res) => {
    const todoId = req.params.ref;
    const todoVal = req.body.todo;
    const isDone = req.body.isDone.trim();
    if (!todoVal || !isDone) {
        res.json(Object.assign({}, error, {
            message: 'todo or isDone are empty.'
        }));
        return;
    }

    if (!isValidValues(req, res)) return;

    Todo.update({ ref: todoId }, { $set: {
        todo: todoVal,
        isDone: isDone
    }}, (err, result) => {
        if (err) {
            res.json(Object.assign({}, error, {
                message: 'occur some error when update'
            }));
            return;
        }

        res.json(success);
    });

});

router.patch('/:ref', (req, res) => {
    const todoId = req.params.ref;
    const isDone = req.body.isDone.trim();
    if (!isDone) {
        res.json(Object.assign({}, error, {
            message: 'isDone is empty.'
        }));
        return;
    }

    const isBoolean = (isDone === 'true') || (isDone === 'false');
    if (!isBoolean) {
        res.json(Object.assign({}, error, {
            message: 'isDone is not Boolean'
        }));
        return;
    }

    Todo.update({ ref: todoId }, { $set: {
        isDone: isDone
    }}, (err, result) => {
        if (err) {
            res.json(Object.assign({}, error, {
                message: 'occur some error when update'
            }));
            return;
        }

        res.json(success);
    });
});

router.delete('/:ref', (req, res) => {
    const todoId = req.params.ref;
    Todo.remove({ ref: todoId }, (err, result) => {
        if (err) {
            res.json(Object.assign({}, error, {
                message: 'occur some error when update'
            }));
            return;
        }

        res.json(success);
    });
});

const isValidValues = (req, res) => {
    const todoVal = req.body.todo;
    const isDoneString = req.body.isDone.trim();
    const isBoolean = (isDoneString === 'true') || (isDoneString === 'false');
    if (typeof todoVal !== 'string' || !isBoolean) {
        res.json(Object.assign({}, error, {
            message: 'todo or isDone are invalid type.'
        }));

        return false;
    }

    return true;
}

export default router;