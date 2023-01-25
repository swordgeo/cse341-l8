const {GraphQLSchema, GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLScalarType, GraphQLList, GraphQLInputObjectType} = require("graphql");
const Character = require('./models/character')


const StatsType = new GraphQLObjectType({
  name: "stats",
  fields: {
    str: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    dex: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    con: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    int: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    wis: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    cha: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});


const characterType = new GraphQLObjectType({
  name: "character",
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    characterName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    playerName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    race: {
      type: new GraphQLNonNull(GraphQLString),
    },
    class: {
      type: new GraphQLNonNull(GraphQLString),
    },
    level: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    alignment: {
      type: new GraphQLNonNull(GraphQLString),
    },
    stats: {
      type: new GraphQLNonNull(StatsType),
      // type: new GraphQLObjectType({
      //   name: "stats",
      //   fields: {
      //     str: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     dex: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     con: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     int: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     wis: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     cha: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //   }
      // }),
    },
  },
});


const StatsInputType = new GraphQLInputObjectType({
  name: "statsInput",
  fields: {
    str: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    dex: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    con: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    int: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    wis: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    cha: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});


const characterInputType = new GraphQLInputObjectType({
  name: "characterInput",
  fields: {
    characterName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    playerName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    race: {
      type: new GraphQLNonNull(GraphQLString),
    },
    class: {
      type: new GraphQLNonNull(GraphQLString),
    },
    level: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    alignment: {
      type: new GraphQLNonNull(GraphQLString),
    },
    stats: {
      type: new GraphQLNonNull(StatsInputType),
      // type: new GraphQLObjectType({
      //   name: "statsInput",
      //   fields: {
      //     str: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     dex: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     con: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     int: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     wis: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //     cha: {
      //       type: new GraphQLNonNull(GraphQLInt),
      //     },
      //   }
      // }),
    },
  },
});



const rootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    characters: {
      type: new GraphQLList(characterType),
      resolve: async () => {
        try {
          return await Character.find();
          //200 is generic success
          // res.status(200).json(characters);
        } catch (err) {
            //500 means server error, not user error
          // res.status(500).json({message: err.message});
          throw new Error(err.message);
        }
      },
    },

    character: {
      type: characterType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, args) => {
        try {
          return await Character.findById(args.id);
          // res.status(200).json(character);
        } catch (err) {
          //500 means server error, not user error
          // res.status(500).json({message: err.message});
          throw new Error(err.message);
        }
      }
    },
  },
});

const rootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createCharacter: {
      type: characterType,
      args: {
        character: {
          type: new GraphQLNonNull(characterInputType),
        },
      },
      resolve: async (_, args) => {
        try {
          return await Character.create(args.character)

        } catch (err) {
          //500 means server error, not user error
          // res.status(500).json({message: err.message});
          throw new Error(err.message);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: rootQuery, 
  mutation: rootMutation,
});