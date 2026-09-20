import { Plugin } from '@nestjs/apollo';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener,
} from '@apollo/server';
import { GraphQLError } from 'graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  constructor(private readonly gqlSchemaHost: GraphQLSchemaHost) {}

  requestDidStart(): Promise<GraphQLRequestListener<BaseContext>> {
    const maxComplexity = 20;
    const { schema } = this.gqlSchemaHost;

    return Promise.resolve({
      didResolveOperation({ request, document }): Promise<void> {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({
              defaultComplexity: 1,
            }),
          ],
        });

        console.log(`GraphQL query complexity: ${complexity}`);

        if (complexity > maxComplexity) {
          throw new GraphQLError(
            `Запрос слишком сложный: ${complexity}. Максимально допустимая сложность: ${maxComplexity}`,
          );
        }

        return Promise.resolve();
      },
    });
  }
}
