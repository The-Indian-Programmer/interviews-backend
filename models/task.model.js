const { Sequelize, DataTypes, Model } = require('sequelize');
const users = require('./user.model');
class Tasks extends Model {
    static associate({users}) {
        // define association here
        this.belongsTo(users, {foreignKey: 'userId', as: 'user' })
    }
}

Tasks.init({
    // Model attributes are defined here
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'userID'
        },
        onDelete: 'CASCADE'
    },
    title: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'low'
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'deleted'),
        allowNull: false,
        defaultValue: 'pending'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
},{sequelize, modelName: 'tasks'});

// the defined model is the class itself
// console.log(Tasks === sequelize.models.Tasks); // true


Tasks.getAllTasks = (data) => {
    return new Promise(async (resolve, reject) => {
        let {where, limit, offset, order, orderBy} = data;
        // status not deleted

        if (!helper.isEmpty(where.status)) {
            where.status = {
                [Sequelize.Op.or]: [where.status],
                [Sequelize.Op.ne]: 'deleted'
            }
        } else {
            where.status = {
                [Sequelize.Op.ne]: 'deleted'
            }
        }

     
        let tasks = await Tasks.findAll({
            where,
            limit,
            offset,
            order: [[orderBy, order]],
            attributes: ['taskId', 'title', 'description', 'dueDate', 'priority', 'status', 'createdAt', 'updatedAt'],
            raw: true
        });

        if (tasks != null) {
            resolve({err: null, data: tasks});
        } else {
            resolve({err: 'MSG014', data: null});
        }
    });
}


Tasks.getAllTaskCount = (data) => {
    return new Promise(async (resolve, reject) => {
        let {where} = data;
        // status not deleted
        if (!helper.isEmpty(where.status)) {
            where.status = {
                [Sequelize.Op.or]: [where.status],
                [Sequelize.Op.ne]: 'deleted'
            }
        } else {
            where.status = {
                [Sequelize.Op.ne]: 'deleted'
            }
        }

        let tasks = await Tasks.count({
            where,
            raw: true
        });


        if (tasks !== null) {
            resolve({err: null, data: tasks});
        } else {
            resolve({err: tasks, data: null});
        }
    });
}

// export default User;
module.exports = Tasks;