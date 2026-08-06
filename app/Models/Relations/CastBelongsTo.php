<?php

namespace App\Models\Relations;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * BelongsTo for integer foreign keys referencing varchar owner keys (PostgreSQL).
 */
class CastBelongsTo extends BelongsTo
{
    public function addConstraints(): void
    {
        if (static::$constraints) {
            $foreignKey = $this->child->getAttribute($this->foreignKey);

            if ($foreignKey === null) {
                $this->query->whereRaw('1 = 0');

                return;
            }

            $this->query->where(
                $this->getQualifiedOwnerKeyName(),
                '=',
                (string) $foreignKey,
            );
        }
    }

    public function getRelationExistenceQuery(Builder $query, Builder $parentQuery, $columns = ['*'])
    {
        if ($parentQuery->getQuery()->from === $query->getQuery()->from) {
            return $this->getRelationExistenceQueryForSelfRelation($query, $parentQuery, $columns);
        }

        return $query->select($columns)->whereRaw(
            sprintf(
                'CAST(%s AS VARCHAR) = %s',
                $this->getQualifiedForeignKeyName(),
                $query->qualifyColumn($this->ownerKey),
            ),
        );
    }
}
