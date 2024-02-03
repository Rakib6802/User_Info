const Model = loadCore('model');
module.exports = class UsersModel extends Model {
    constructor() {
        super();
        this.table = 'users';
        this.primaryKey = 'id';
        this.select = ["id", "primary_phone", "name","area","address", "is_active", "created_at"];
    }
}

